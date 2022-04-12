import { Command, OptionValues } from 'commander';
import { writeFile } from 'fs/promises';
import path from 'path';
import shell from 'shelljs';
import { cli } from '..';
import { copyFolder } from '../utils/fs';
import { validateEmail } from '../utils/strings';

export const setupCommand = new Command('setup')
	.description('Installs Docker and docker-compose (if not installed) and sets up the nginx-proxy')
	.argument('[root]', 'Root path to copy the nginx-proxy folder to', process.cwd())
	.requiredOption('-e, --email <email>', "Let's Encrypt email for reminders etc.")
	.action(async (root: string, options: OptionValues) => {
		const proxyPath = path.join(root, 'nginx-proxy');

		if (!validateEmail(options.email)) {
			cli.error(
				`The passed email "${options.email}" is not valid, please provide a valid email address`
			);
		}

		await copyFolder(path.join(__dirname, '../../public/nginx-proxy'), root);
		await writeFile(`${proxyPath}/.env`, `LETSENCRYPT_EMAIL=${options.email}`);

		if (!shell.which('docker')) {
			// install docker
			shell.echo(
				'Docker is not installed on your system but required for nginx-proxy. Installing Docker...'
			);
			if (shell.exec('curl -fsSL https://get.docker.com | bash').code !== 0) {
				cli.error(`Error: Unable to automatically install Docker`);
			}
		}

		if (!shell.which('docker-compose')) {
			// install docker-compose
			shell.echo(
				'docker-compose is not installed on your system but required for nginx-proxy. Installing docker-compose...'
			);
			if (
				shell.exec(`
      VERSION=$(curl --silent https://api.github.com/repos/docker/compose/releases/latest | grep -Po '"tag_name": "\K.*\d') &&
      DESTINATION=/usr/local/bin/docker-compose &&
      sudo curl -L https://github.com/docker/compose/releases/download/\${VERSION}/docker-compose-$(uname -s)-$(uname -m) -o $DESTINATION &&
      sudo chmod +x $DESTINATION
      `).code !== 0
			) {
				cli.error(`Error: Unable to automatically install docker-compose`);
			}
		}

		shell.echo('Creating nginx-proxy docker network...');

		const { stderr, code } = shell.exec('docker network create nginx-proxy');
		if (
			code !== 0 &&
			stderr.replace('\n', '').trim() !==
				`Error response from daemon: network with name nginx-proxy already exists`
		) {
			cli.error(
				`Error: Unable to create nginx-proxy docker network, please create it manually with: docker network create nginx-proxy`
			);
		}

		shell.echo('Successfully set up nginx-proxy. You can start it using "docker-compose up -d"');
	});
