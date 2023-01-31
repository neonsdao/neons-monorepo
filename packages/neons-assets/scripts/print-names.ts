import * as fs from 'fs';
import * as path from 'path';

const directory = '/Users/adam/Desktop/anon/nouns-monorepo/packages/neons-assets/images';
const output: { [key: string]: string[] } = {};

function getFiles(dir: string): void {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filepath = path.join(dir, file);
    if (fs.lstatSync(filepath).isDirectory()) {
      getFiles(filepath);
    } else {
      const parentDir = path.dirname(filepath);
      const filename = file.split('-')[1];
      if (!output[parentDir]) {
        output[parentDir] = [filename];
      } else {
        output[parentDir].push(filename);
      }
    }
  }
}

getFiles(directory);
console.log(JSON.stringify(output));
