import shell from 'shelljs';

export async function exists(path: string): Promise<boolean> {
	return shell.exec(`[ ! -d ${path} ] && exit 1`).code === 0;
}
