
var geocoder = require('geocoder');
var redis = require('redis');
var client = redis.createClient();
var indexes = require('./indexes');

function Crime(incident, reported, rd, description, beat, address) {
  this.incident = incident;
  this.reported = reported;
  this.rd = rd;
  this.description = description;
  this.beat = beat;
  this.address = address;
}

Crime.prototype.setId = function(id) {
  this.id = id;
};

Crime.prototype.geocode = function(callback) {
  var self = this;
  if (!this.address) {
    callback();
    return;
  }
  if (this.location) {
    // this was already geocoded
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

function getCrimeKey(id) {
  return 'CRIME:'+id;
}

Crime.prototype.store = function(callback) {
  // redis structure: hash names CRIMES with id -> json blob
  client.set(getCrimeKey(this.id), this.toJson(), callback);
};

Crime.prototype.addIndex = function(index, callback) {
  // add this crime id as a member in the set INDEX:<string>
  client.sadd(indexes.getIndexKey(index), this.id, callback);
};

Crime.prototype.addBeatIndex = function(callback) {
  this.addIndex(this.beat, callback);
};

Crime.prototype.toJson = function() {
  return JSON.stringify(this);
};

exports.Crime = Crime;
