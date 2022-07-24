#!/usr/bin/env node

import { Command } from "commander";
import { deployCommand } from "./commands/deploy.command";
const { version } = require("../package.json");

export const cli = new Command();
cli.version(version, "-v, --version");

cli.addCommand(deployCommand);

cli.parse();
