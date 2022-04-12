#!/usr/bin/env node

import { Command } from 'commander';
import { deployCommand } from './commands/deploy.command';
import { setupCommand } from './commands/setup.command';
const { version } = require('../package.json');

export const cli = new Command();
cli.version(version, '-v, --version');

cli.addCommand(deployCommand).addCommand(setupCommand);

cli.parse();
