const program = require('commander');
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

try {
  fs.readdir('../', 'utf8', (err, files) => {
    iterateProjects(files);
  });
} catch (error) {
  console.log('Error occured', error);
}

async function showDir(dirName) {
  try {
    const { stdout, stderr } = await exec(
      `cd.. && cd ${dirName} && rmdir /S/Q node_modules`
    );
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
  } catch (error) {
    console.log('Error occured', error);
  }
}

//showDir();

async function iterateProjects(projects) {
  for (let i = 0; i < projects.length; i++) {
    await showDir(projects[i]);
  }
}
