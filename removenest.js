const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const chalk = require('chalk');

try {
  fs.readdir('../', 'utf8', (err, files) => {
    parseData(files);
  });
} catch (error) {
  console.log('Error occured', error);
}

async function parseData(projects) {
  projects = projects.filter(data => {
    if (data === 'delete-node-modules') {
      console.log('deleted....');
      return false;
    }
    return true;
  });

  console.log(projects);

  for (const folder of projects) {
    await huntNodeModules(folder);
  }
}

let i = 1;
async function huntNodeModules(folder) {
  try {
    const nestedFolders = giveNestedFolders(folder);
    console.log(nestedFolders);
    for (const dir of nestedFolders) {
      try {
        const { stdout, stderr } = await exec(
          `cd.. && cd ${folder} && cd ${dir} && rmdir /S/Q node_modules`
        );

        console.log(chalk.green('Successsss'));
      } catch (error) {
        console.log(i);
        i += 1;
        console.log(chalk.red(`Could not delete: ${folder}/${dir}`));
      }
    }
  } catch (error) {
    console.log(chalk.red('Something wrong in nested folder: ', folder));
  }
}

function giveNestedFolders(folder) {
  try {
    const files = fs
      .readdirSync(`../${folder}`)
      .filter(dir => {
        const stat = fs.lstatSync(`../${folder}/${dir}`);
        return stat.isDirectory();
      })
      .map(dir => dir);
    return files;
  } catch (error) {
    console.log('Error occured', error);
  }
}
