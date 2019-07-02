const fs = require('fs');
const path = require('path');

const data = {
  lastBuildTime: new Date()
};

const fileName = 'build.json';
const srcDirectory = path.join('projects/campus-cloud/src/assets');

fs.writeFile(`${srcDirectory}/${fileName}`, JSON.stringify(data), (err) => {
  if (err) {
    throw err;
  }

  console.log(`${fileName} created successfully`);
});
