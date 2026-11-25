const { spawn } = require('node:child_process');
const path = require('node:path');

const processes = [
    spawn(process.execPath, ['--watch', 'index.js'], {
        cwd: path.join(__dirname, 'server'),
        stdio: 'inherit',
        shell: false
    }),
    spawn(process.execPath, ['node_modules/vite/bin/vite.js'], {
        cwd: path.join(__dirname, 'client'),
        stdio: 'inherit',
        shell: false
    })
];

function shutdown() {
    for (const child of processes) {
        child.kill();
    }
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
