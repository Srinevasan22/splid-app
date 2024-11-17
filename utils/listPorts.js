const { exec } = require('child_process');

function listPorts() {
    exec('sudo lsof -i -P -n | grep LISTEN', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing command: ${error.message}`);
            return;
        }

        if (stderr) {
            console.error(`Error: ${stderr}`);
            return;
        }

        console.log('List of all ports currently in use:');
        console.log('----------------------------------');
        console.log(stdout);
    });
}

listPorts();
