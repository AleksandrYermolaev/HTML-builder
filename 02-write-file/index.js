const path = require("path");
const fs = require('fs');
const { stdin } = process;
const textDir = path.join(__dirname, 'text.txt');
fs.access(
	textDir, 
	fs.constants.F_OK,
	(err) => {
		if (err) fs.writeFile(textDir, '', err => {
			if (err) throw err;
		});
	}
);
console.log('Enter your text:');
stdin.on('data', data => {
	const message = data.toString();
	fs.appendFile(textDir, message, err => {
		if (err) throw err;
	});
	if (message.slice(0, 4) === 'exit') {
		process.exit();
	}
});
process.on('SIGINT', () => process.exit());
process.on('exit', () => console.log('Bye! See you later!'));