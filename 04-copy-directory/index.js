const path = require('path');
const fs = require('fs');
const { mkdir, copyFile, access, readdir } = require('fs/promises');

const copyPath = path.join(__dirname, 'files');
const destPath = path.join(__dirname, 'files-copy');

isFolderExists()

async function isFolderExists() {
	try {
		await access(destPath);
		await cleanFolder();
		copyFiles();
	  } catch {
		await mkdir(destPath);
		copyFiles();
	}
}

async function cleanFolder() {
	try {
		const files = await readdir(destPath);
		files.forEach(value => {
			fs.unlink(path.join(destPath, value), (err) => { if (err) throw err });
		});
	  } catch (err) {
		throw err;
	}
}

async function copyFiles() {
	try {
		const files = await readdir(copyPath);
		files.forEach(value => {
			copyFile(path.join(copyPath, value), path.join(destPath, value));
		});
	  } catch (err) {
		throw err;
	}
}

