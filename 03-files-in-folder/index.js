const path = require('path');
const fs = require('fs');
const { readdir } = require('fs/promises');
const curDir = path.join(__dirname, 'secret-folder');

readdir(curDir, {withFileTypes: true})
  .then((items) => {
	const filesArr = items.filter(item => item.isFile());
	filesArr.forEach(value => {
		const ext = path.extname(value.name);
		const name = path.basename(value.name, ext);
		const curPath = path.join(__dirname, 'secret-folder', value.name);
		fs.stat(curPath, (err, stats) => {
			if (err) throw err;
			const size = stats.size / 1024
			const result = `${name} - ${ext.slice(1)} - ${size}kb`;
			console.log(result);
		});
	});
  });
