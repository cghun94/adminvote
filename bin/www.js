#!/usr/bin/env env파일
require('dotenv').config();

const app = require('../app');
const debug = require('debug')('myapp:server');
const http = require('http');