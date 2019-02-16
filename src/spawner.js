'use strict';

const child_process = require('child_process');

const args = process.argv.slice(2);
const green = input => `\u{1b}[32m${input}\u{1b}[0m`;

const spawn = bus => {
  let subprocess;

  const setupProcess = () => {
    subprocess = child_process.spawn('node', args, { stdio: 'inherit' });

    bus.once('change', () => {
      process.stderr.write(green('\nFile change detected, restarting process...\n\n'), () => {
        subprocess.kill();
        setupProcess();
      });
    });
  };

  console.log(green('\nstarting process in watch mode...\n'));
  setupProcess();
};

module.exports = { spawn };
