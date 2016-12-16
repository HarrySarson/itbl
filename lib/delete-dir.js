
const fs = require('bluebird').promisifyAll(require('fs'));
const pathUtil = require('path');

/**
 * Deletes directory `dirPath` along with any files and directories
 * contained within `dirPath`.
 *
 * If `dirPath` does exist or is not a directory then the promise will
 * be rejected.
 *
 * @param {string} dirPath Directory to delete.
 * @returns {Promise} Returns promise which will resolve once directory is deleteted.
 *
 * @example
 *
 * const deletedir = require('delete-dir');
 *
 * deletedir('./images')
 *  .then(() => console.log('deletion successful')
 *  .catch(err => console.log('error deleting directory: ', err));
 *
 */
module.exports =
async function deletedir(dirPath) {

  let files = await fs.readdirAsync(dirPath);

  let promises = files.map(async fileName => {

    let curPath = pathUtil.join(dirPath, fileName);

    if ((await fs.lstatAsync(curPath)).isDirectory()) {
      // promise which will resolve when the directory is deleted
      await deletedir(curPath, dirStructure);
    } else {
      // promise which will resolve when file is deleted
      await fs.unlinkAsync(curPath);
    }
  });

  // delay untill deletion of all files and directories within directory is complete
  await Promise.all(promises);

  // delete the (now empty) directory
  await fs.rmdirAsync(dirPath);
};
