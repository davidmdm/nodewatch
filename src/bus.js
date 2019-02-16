'use strict';

const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');

const cwd = process.cwd();

const isDirectory = path => fs.statSync(path).isDirectory();

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const getAllSubDirs = root => {
  const dirs = fs
    .readdirSync(root)
    .filter(x => !['node_modules', '.git', '.vscode', '.idea'].includes(x))
    .map(x => path.join(root, x))
    .filter(isDirectory);

  return [].concat.apply([root], dirs.map(getAllSubDirs));
};

const getBus = () => {
  const bus = new EventEmitter();

  let watchers;

  const watch = () => {
    let reset = null;

    watchers = getAllSubDirs(cwd).map(dir => {
      return fs.watch(dir, () => {
        if (!reset) {
          bus.emit('change');
          for (const watcher of watchers) {
            watcher.close();
          }
          reset = sleep(50).then(watch);
        }
      });
    });
  };

  watch();

  return bus;
};

module.exports = { getBus };
