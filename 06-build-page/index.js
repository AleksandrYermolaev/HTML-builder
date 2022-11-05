const path = require('path');
const fs = require('fs');
const { mkdir, copyFile, access, readdir, readFile, rm } = require('fs/promises');
const assetsFolder = path.join(__dirname, 'assets');
const destFolder = path.join(__dirname, 'project-dist');

initProject();

async function initProject() {
  await isFolderExists();
  await runBuild(destFolder);
}

async function isFolderExists() {
  try {
    await access(destFolder);
    } catch {
    await mkdir(destFolder, {recursive: true});
  }
}

async function runBuild(folder) {
  try {
    const files = await readdir(folder, { withFileTypes: true });
    if (files.length > 0) {
      files.forEach( async value => {
        rm(folder, {recursive: true})
          .then(() => mkdir(destFolder, {recursive: true}))
          .then(() => copyAssets(assetsFolder, path.join(destFolder, 'assets')))
          .then(() => bundleStyles())
          .then(() => bundleHtml());
        
      });
    } else {
      copyAssets(assetsFolder, path.join(destFolder, 'assets'))
      .then(() => bundleStyles())
      .then(() => bundleHtml());
    }
    
    } catch (err) {
    throw err;
  }
}

async function copyAssets(source, dest) {
	try {
    await mkdir(dest, { recursive: true });
		const assets = await readdir(source, { withFileTypes: true });
		assets.forEach(async value => {
			if (value.isDirectory()) {
        const innerSource = path.join(source, value.name);
        const innerDest = path.join(dest, value.name);
        copyAssets(innerSource, innerDest);
      } else {
        copyFile(path.join(source, value.name), path.join(dest, value.name));
      }
		});
	  } catch (err) {
		throw err;
	}
}

async function bundleStyles() {
  const destPath = path.join(__dirname, 'project-dist', 'style.css');
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
}

async function bundleHtml() {
  const destPath = path.join(__dirname, 'project-dist', 'index.html');
  const templateFile = path.join(__dirname, 'template.html');
  const componentsPath = path.join(__dirname, 'components');
  const components = await readdir(componentsPath, { withFileTypes: true });
  const htmlFiles = components
    .filter(file => file.isFile())
    .filter(file => path.extname(file.name) === '.html')
    .map(file => file.name);
  const componentsArray = await createTemplates(htmlFiles);
  let templateText = await readFile(templateFile, 'utf-8'); 
  componentsArray.forEach(value => {
    for (let key in value) {
      templateText = templateText.replace(key, value[key]);
    }
  });
  const indexWrite = fs.createWriteStream(destPath);
  indexWrite.write(templateText, (err) => { if (err) throw err });
}

async function createTemplates(htmlFiles) {
  const arr = [];
  const componentsPath = path.join(__dirname, 'components');
  for (let file of htmlFiles) {
    const templateProperty = `{{${file.replace('.html', '')}}}`;
    const data = await readFile(path.join(componentsPath, file), 'utf-8');
    const templateValue = data.toString();
    arr.push( {[templateProperty]: templateValue} );
  }
  return arr;
}


