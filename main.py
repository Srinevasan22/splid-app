import json
import os
import hmac
import hashlib
from flask import Flask, render_template, request, redirect, url_for, send_file, jsonify
from flask_cors import CORS
from flask_talisman import Talisman  # Import Flask-Talisman
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import io

app = Flask(__name__)

# Enable CORS for your WordPress domain
CORS(app, resources={r"/*": {"origins": "https://srinevasan.com"}})

# Enable HTTPS with Flask-Talisman
Talisman(app, force_https=True, content_security_policy={
    'default-src': ['\'self\'', 'https://maxcdn.bootstrapcdn.com', 'https://ajax.googleapis.com'],
    'script-src': ['\'self\'', 'https://ajax.googleapis.com', '\'unsafe-inline\''],
    'style-src': ['\'self\'', 'https://maxcdn.bootstrapcdn.com', '\'unsafe-inline\'']
})

DATA_FILE = 'expense_data.json'

# Define your secret key
secret = b'eIMR5amQ3ezShLwOOalX76aTRZBhp5kj'

# Load data from file
def load_data():
    try:
        with open(DATA_FILE, 'r') as f:
            data = json.load(f)
            return data.get('participants', {}), data.get('expenses', [])
    except FileNotFoundError:
        return {}, []

# Save data to file
def save_data():
    global participants, expenses
    with open(DATA_FILE, 'w') as f:
        json.dump({'participants': participants, 'expenses': expenses}, f)

# Load the data
participants, expenses = load_data()

# Home route
@app.route('/')
def index():
    return render_template('index.html', participants=participants, expenses=expenses, enumerate=enumerate)

# API endpoint to return participants and expenses
@app.route('/api/data', methods=['GET'])
def get_data():
    return jsonify(participants=participants, expenses=expenses)

# Webhook endpoint to handle GitHub webhook requests
@app.route('/webhook', methods=['POST'])
def webhook():
    signature = request.headers.get('X-Hub-Signature')
    if signature is None:
        return '', 400  # Bad Request

    # Compute the HMAC digest
    sha_name, signature = signature.split('=')
    if sha_name != 'sha1':
        return '', 400  # Bad Request

    # Calculate the HMAC of the payload
    mac = hmac.new(secret, request.data, hashlib.sha1)
    if not hmac.compare_digest('sha1=' + mac.hexdigest(), signature):
        return '', 403  # Forbidden

    data = request.json
    app.logger.info("Webhook received: %s", data)

    # Automatically pull the latest changes
    os.system('cd ~/splid_app && git pull origin main')
    os.system('systemctl restart gunicorn')

    return '', 200  # Respond with a 200 status code

# Add participant
@app.route('/add_participant', methods=['POST'])
def add_participant():
    name = request.form['name']
    if name not in participants:
        participants[name] = {'balance': 0.0, 'removed': False}
    save_data()
    return redirect(url_for('index'))

# Add expense
@app.route('/add_expense', methods=['POST'])
def add_expense():
    name = request.form['payer']
    amount = float(request.form['amount'])
    category = request.form['category']
    split_type = request.form['split_type']

    if split_type == "equal":
        split_amount = amount / len([p for p in participants if not participants[p]['removed']])
        for participant in participants:
            if not participants[participant]['removed']:
                participants[participant]['balance'] += round(split_amount, 2)
    elif split_type == "unequal":
        shares = {}
        for participant in participants:
            share = float(request.form.get(f"share_{participant}", 0))
            shares[participant] = share
        total_shares = sum(shares.values())
        for participant, share in shares.items():
            if not participants[participant]['removed']:
                participants[participant]['balance'] += round((amount * (share / total_shares)), 2)

    expenses.append({"name": name, "amount": round(amount, 2), "category": category})
    save_data()
    return redirect(url_for('index'))

# Generate PDF report
@app.route('/generate_pdf', methods=['GET', 'POST'])
def generate_pdf():
    buffer = io.BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=letter)
    pdf.setTitle("Expense Report")

    # Add title
    pdf.drawString(100, 750, "Final Expense Report")

    # Add total expenses
    total_expense = sum([expense['amount'] for expense in expenses])
    pdf.drawString(100, 730, f"Total Expenses: ${total_expense:.2f}")

    # Add detailed expense info
    pdf.drawString(100, 710, "Detailed Expenses:")
    y_position = 690
    for expense in expenses:
        pdf.drawString(100, y_position, f"{expense['name']} paid ${expense['amount']:.2f} for {expense['category']}")
        y_position -= 20

    # Add balances for each participant
    pdf.drawString(100, y_position - 20, "Who Owes Whom:")
    y_position -= 40
    for name, details in participants.items():
        if not details['removed']:
            if details['balance'] > 0:
                pdf.drawString(100, y_position, f"{name} is owed ${details['balance']:.2f}")
            elif details['balance'] < 0:
                pdf.drawString(100, y_position, f"{name} owes ${-details['balance']:.2f}")
            else:
                pdf.drawString(100, y_position, f"{name} is settled.")
            y_position -= 20

    # Save the PDF to the buffer
    pdf.showPage()
    pdf.save()

    buffer.seek(0)
    return send_file(buffer, as_attachment=True, download_name="expense_report.pdf", mimetype='application/pdf')

# Clear all data
@app.route('/clear_data', methods=['POST'])
def clear_data():
    global participants, expenses
    participants = {}
    expenses = []
    save_data()
    return redirect(url_for('index'))

# Remove participant
@app.route('/remove_participant/<name>', methods=['POST'])
def remove_participant(name):
    if name in participants:
        keep_expenses = request.form['keep_expenses'] == 'yes'
        if not keep_expenses:
            expenses[:] = [expense for expense in expenses if expense['name'] != name]
        participants[name]['removed'] = True
        save_data()
    return redirect(url_for('index'))

# Remove an expense
@app.route('/remove_expense/<int:index>')
def remove_expense(index):
    if 0 <= index < len(expenses):
        expense_to_remove = expenses.pop(index)
        name = expense_to_remove["name"]
        amount = expense_to_remove["amount"]
        participants[name]['balance'] -= round(amount, 2)
    save_data()
    return redirect(url_for('index'))

# Run the app
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"App running on port {port}")
    app.run(host='0.0.0.0', port=port, ssl_context=('path/to/cert.pem', 'path/to/key.pem'))  # Update paths to your certificate
