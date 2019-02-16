#!/usr/bin/env node

'use strict';

const { getBus } = require('./bus');
const { spawn } = require('./spawner');

const bus = getBus();

spawn(bus);
