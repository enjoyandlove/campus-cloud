const shell = require('shelljs');
const path = require('path');
const fs = require('fs');

const lastBuildTime = new Date();
const commitId = shell.exec('git rev-parse HEAD', { silent: true }).stdout.replace('\n', '');

const data = {
  commitId,
  lastBuildTime
};
const fileName = 'build.json';
const srcDirectory = path.join('projects/campus-cloud/src/assets');

fs.writeFile(`${srcDirectory}/${fileName}`, JSON.stringify(data), (err) => {
  if (err) {
    throw err;
  }

  console.log(`${fileName} created successfully`);
});
