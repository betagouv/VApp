import fs from 'node:fs/promises';
import path from 'node:path';
import type { Dirent } from 'node:fs';

const staticSrcPath = path.join(__dirname, '../.next/static');
const staticDestPath = path.join(__dirname, '../.next/standalone/.next/static');

const publicSrcPath = path.join(__dirname, '../public');
const publicDestPath = path.join(__dirname, '../.next/standalone/public');

// @ts-expect-error didn't bother
function copyAssets(src: string, dest: string) {
  return fs
    .mkdir(dest, { recursive: true })
    .then(() => fs.readdir(src, { withFileTypes: true }))
    .then((items: Dirent[]) => {
      // @ts-expect-error didn't bother
      const promises = items.map((item: Dirent) => {
        const srcPath = path.join(src, item.name);
        const destPath = path.join(dest, item.name);

        if (item.isDirectory()) {
          return copyAssets(srcPath, destPath);
        } else {
          return fs.copyFile(srcPath, destPath);
        }
      });
      return Promise.all(promises);
    })
    .catch((err) => {
      console.error(`Error: ${err}`);
      throw err;
    });
}

const greenTick = `\x1b[32m\u2713\x1b[0m`;
const redCross = `\x1b[31m\u274C\x1b[0m`;
copyAssets(staticSrcPath, staticDestPath)
  .then(() => copyAssets(publicSrcPath, publicDestPath))
  .then(() => console.log(`${greenTick} Assets copied successfully`))
  .catch((e: Error) => console.error(`${redCross} Failed to copy assets: ${e}`));
