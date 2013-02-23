#!/usr/bin/env node

var fs = require('fs');
var async = require('async');
var optimist = require('optimist');
var carrier = require('carrier');
var Crime = require('../lib/crime').Crime;
var csv = require('csv');

// should i provide a way to either load redis or provide newline-delimited json? or maybe output a json array
function cleanAddress(addr) {
  if (!addr.match(/oakland/i)) addr = addr + ', Oakland, CA';
  return addr;
}

function csvToCrime(items) {
  if (!items) return;
  // incident, reported, rd, description, beat, address
  return new Crime(
    items[0]
    , items[1]
    , items[2]
    , items[3]
    , items[4]
    , cleanAddress(items[5])
  );
}


var argv = optimist
  .usage('\n./$0 {options}')
  .options('json', {'desc': 'newline-delimited json to stdout instead of storing', 'default': false})
  .options('geocode', {'desc': 'try to geocode each crime', 'default': false})
  .argv;

// open the file, read a line at a time, turn it into a json object, geocode it, store it, index it
var CSV_NAME = 'data/OPD_PublicCrimeData_2007-12.csv';
var fileStream = fs.createReadStream(CSV_NAME, {flags: 'r'});
var crime_count = 0
process.stderr.write('Processing '+ CSV_NAME +'…');
csv()
  .from.stream(fileStream)
  .transform(function(data){
    var crime = csvToCrime(data)
    if (crime) {
      async.waterfall([
        function geocode(cb) {
          if (argv.geocode) {
            crime.geocode(cb);
          } else cb();
        },
        function store(cb) {
          crime_count++;
          if (argv.json) {
            cb();
          } else crime.store(cb);
        }
        , function index(cb) {
          if (argv.geocode) {
            crime.addBeatIndex(cb);
            // todo: index by other shapefiles
          } else cb();
        }
      ], function(err) {
        if (err) process.stderr.write('Error loading crime: '+ JSON.stringify(crime) +', Error: '+ JSON.stringify(err));
      });
    }
  });
