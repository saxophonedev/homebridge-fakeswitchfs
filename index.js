"use strict";

var fs = require("fs");
var Service, Characteristic, HomebridgeAPI;

module.exports = function(homebridge) {

  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  HomebridgeAPI = homebridge;

  HomebridgeAPI.registerAccessory("homebridge-fakeswitch", "FakeSwitch", FakeSwitch);
}

function FakeSwitch(log, config) {
  this.log = log;
  this.name = config.name;
  this.filePath = HomebridgeAPI.user.persistPath() + "/" + this.name + "_conf.txt";

  this._service = new Service.Switch(this.name);
  this._service.getCharacteristic(Characteristic.On)    
    .on('get', this._get.bind(this))
    .on('set', this._set.bind(this));
}

FakeSwitch.prototype.getServices = function() {
  return [this._service];
}

FakeSwitch.prototype._set = function (state, callback){
    fs.writeFile(this.filePath, state + '', "utf8", function(err){ if (err) throw err; callback(null); });
}

FakeSwitch.prototype._get = function(callback){
    fs.readFile(this.filePath, function(err, data){ if (err) throw err; callback(null, parseInt(data) ); });
}