const Papa = require('papaparse');
const path = require('path');
const glob = require('glob');
const fs = require('fs');
const pkgDir = require('pkg-dir').sync();

const rootDir = path.resolve(pkgDir, '../..');

const dataDir = path.resolve(rootDir, 'node_modules/covid-19/csse_covid_19_data/csse_covid_19_daily_reports');

/**
 * Extract filename and extention from filepath
 *
 * @param {String} filePath the full filepath
 */
function getFileName(filePath) {
  return filePath.substring(filePath.lastIndexOf('/'), filePath.lastIndexOf('.'));
}

/**
 * Writes parsed JSON data to file
 *
 * @param {String} filePath the full filepath
 * @param {Object} results the result of CSV parsing
 */
function writeCsvDataToFile(filePath, results) {
  const { data } = results;
  if (!fs.existsSync(`${pkgDir}/json-data`)) {
    fs.mkdirSync(`${pkgDir}/json-data`);
  }
  if (!fs.existsSync(`${pkgDir}/json-data/daily`)) {
    fs.mkdirSync(`${pkgDir}/json-data/daily`);
  }

  fs.writeFileSync(`${pkgDir}/json-data/daily/${getFileName(filePath)}.json`, JSON.stringify(data));
}

/**
 * Parses a Csv file
 *
 * @param {String} filePath the full filepath
 */
function parseCsvFile(filePath) {
  const csvData = fs.readFileSync(filePath, 'utf8');
  Papa.parse(csvData, {
    header: true,
    complete(results) {
      writeCsvDataToFile(filePath, results);
    },
  });
}

glob(`${dataDir}/*.csv`, (err, files) => {
  if (!err) {
    files.forEach(parseCsvFile);
  }
});
