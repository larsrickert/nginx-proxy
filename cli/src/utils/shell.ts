import shell from 'shelljs';

export function exists(path: string): boolean {
	return shell.exec(`[ ! -d ${path} ] && exit 1`).code === 0;
}
