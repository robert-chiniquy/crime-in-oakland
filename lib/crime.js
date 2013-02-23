
var geocoder = require('geocoder');

function Crime(incident, reported, rd, description, beat, address) {
  this.incident = incident;
  this.reported = reported;
  this.rd = rd;
  this.description = description;
  this.beat = beat;
  this.address = address;
}

Crime.prototype.geocode = function(callback) {
  var self = this;
  if (!this.address) {
    callback();
    return;
  }
  geocoder.geocode(this.address, function(err, data) {
    if (err) {
      callback(err);
      return;
    }
    if (!data || !data.results || !data.results[0] || !data.results[0].geometry) {
      callback({message: "Unexpected geocode result", data: data});
      return;
    }
    self.location = data.results[0].geometry.location; // {lat: ..., lng: ...}
    callback();
  });
};

Crime.prototype.store = function(callback) {
  // redis structure: hash names CRIMES with id -> json blob where id is anything, the sha1 of the original record?
  // set this.id ?
  callback();
};

Crime.prototype.addIndex = function(string, callback) {
  // add this crime id as a member in the set INDEX:<string>
  
  callback();
};

Crime.prototype.addBeatIndex = function(callback) {
  this.addIndex(this.beat, callback);
};

Crime.prototype.toJson = function() {
  return JSON.stringify(this);
};

exports.Crime = Crime;
