const path = require('path');
const fs = require('fs');
const readStream = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');
readStream.on('data', chunk => console.log(chunk));
