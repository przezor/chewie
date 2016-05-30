'use strict';
const fs = require('fs'),
  async = require('async'),
  path = require('path');


/**
 * getFilesFromLocations is a function that will read path or array of paths and return dirs/files in them
 * @param  {String/Array}  locations  String or an Array of paths to be read from
 * @param  {Function}      cb         Callback after everything is finished
 */
function getFilesFromLocations(locations, cb) {
  if(typeof locations === 'string'){
    fs.readdir(locations, (err, files) => {
      cb(err, files);
    });
  }
  else if(Array.isArray(locations)){
    const asyncArray = [];
    locations.forEach((location) => {
      asyncArray.push(_readDirCallback(location));
    });

    async.parallel(asyncArray, (err, results) => {
      let array = [];
      if(!results) return cb(!results);

      array = [].concat.apply(results);
      array = [].concat.apply([], array); // to flatten them to one level
      array = array.filter((n) => {
        return n; //remove falsey values (if it will be evaluated as false then it will be removed from filter)
      });

      if(!array) return cb('There are no files');
      return cb(null, array);
    });
  }
  else cb('You need to pass string or an array');
}

function _readDirCallback(location){
  return (callback) => {
    const normalizedPath = path.resolve(process.cwd(), location);
    fs.readdir(normalizedPath, (err, results) => {
      callback(null, !err && results); //false if there is an error, array if there is no error - readdit error was stopping async
    });
  };
}

module.exports = {
  getFilesFromLocations
};
