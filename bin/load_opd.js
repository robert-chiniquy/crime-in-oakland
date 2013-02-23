#!/usr/bin/env node

var fs = require('fs');
var async = require('async');
var carrier = require('carrier');
var Crime = require('../lib/crime').Crime;

// should i provide a way to either load redis or provide newline-delimited json? or maybe output a json array
function cleanAddress(addr) {
  if (!addr.match(/oakland/i)) {
    addr = addr + ', Oakland, CA';
  }
  return addr;
}

function csvToCrime(line) {
  var
    line_pattern = /("[^"]*")*,("[^"]*")*,("[^"]*")*,("[^"]*")*,("[^"]*")*,("[^"]*")*/,
    items = line_pattern.exec(line);

  if (!items) {
    return;
  }

  items = items.map(function stripQuotes(item) {
    item = item || '';
    return item.replace(/"/g, '');
  });

  // incident, reported, rd, description, beat, address
  return new Crime(items[1], items[2], items[3], items[4], items[5], cleanAddress(items[6]));
}


// open the file, read a line at a time, turn it into a json object, geocode it, store it, index it
var CSV_NAME = 'data/OPD_PublicCrimeData_2007-12.csv';
var fileStream = fs.createReadStream(CSV_NAME, {flags: 'r'});
var processor = async.queue(function(crime, callback) {
  async.waterfall([
//    function store(callback) {
//      crime.store(callback);
//    },
    function geocode(callback) {
      crime.geocode(callback);
    },
    function store(callback) {
      crime.store(callback);
    },
    function index(callback) {
      setTimeout(callback, 600);
      //callback();
    }], callback);
}, 1);

console.log('Processing '+ CSV_NAME);
carrier.carry(fileStream, function(line) {
  var crime = csvToCrime(line);
  if (crime) {
    processor.push(crime);
  }
});

