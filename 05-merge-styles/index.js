const path = require('path');
const fs = require('fs');
const destPath = path.join(__dirname, 'project-dist', 'bundle.css');
const copyPath = path.join(__dirname, 'styles');
const write = fs.createWriteStream(destPath);
fs.readdir(copyPath, { withFileTypes: true }, (err, files) => {
	if (err) throw err;
	const cssFiles = files
		.filter(file => file.isFile())
		.filter(file => path.extname(file.name) === '.css');
	cssFiles.forEach(value => {
		const copyFile = path.join(copyPath, value.name);
		const read = fs.createReadStream(copyFile, 'utf-8');
		read.pipe(write);
	});
});