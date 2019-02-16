'use strict';

const fs = require('fs');
const EventEmitter = require('events');

const root = process.cwd();

const isDirectory = path => fs.statSync(path).isDirectory();

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const getAllSubDirs = root => {
  const dirs = fs
    .readdirSync(root)
    .filter(x => x !== 'node_modules')
    .map(x => root + '/' + x)
    .filter(isDirectory);

  return [root, ...[].concat(...dirs.map(getAllSubDirs))];
};

const getBus = () => {
  const bus = new EventEmitter();

  let watchers;

  const watch = () => {
    let reset = null;

    watchers = getAllSubDirs(root).map(dir => {
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
