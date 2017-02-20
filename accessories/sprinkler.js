var wink = require('wink-jsV2');
var inherits = require('util').inherits;

/*
 *   Generic Accessory
 */
var WinkAccessory, Accessory, Service, Characteristic, uuid;

/*
 *   Lock Accessory
 */

module.exports = function (oWinkAccessory, oAccessory, oService, oCharacteristic, ouuid) {
	if (oWinkAccessory) {
		WinkAccessory = oWinkAccessory;
		Accessory = oAccessory;
		Service = oService;
		Characteristic = oCharacteristic;
		uuid = ouuid;

		inherits(WinkSprinklerAccessory, WinkAccessory);
		WinkSprinklerAccessory.prototype.loadData = loadData;
		WinkSprinklerAccessory.prototype.deviceGroup = 'Sprinklers';
	}
	return WinkSprinklerAccessory;
};
module.exports.WinkSprinklerAccessory = WinkSprinklerAccessory;

function WinkSprinklerAccessory(platform, device) {
	WinkAccessory.call(this, platform, device, device.zone_id);

	var that = this;

	//Is Sprinkler System Powered:
	this
		.addService(Service.Switch)
		.getCharacteristic(Characteristic.On)
		.on('get', function (callback) {
			callback(null, that.device.last_reading.powered);
		})
		.on('set', function (value, callback) {
			that.updateWinkProperty(callback, "powered", value);
		});
    

	this.loadData();
}

var loadData = function () {
	this.getService(Service.AccessoryInformation)
          .setCharacteristic(Characteristic.Manufacturer, this.device.device_manufacturer)
          .setCharacteristic(Characteristic.Model, this.device.model_name)
          .setCharacteristic(Characteristic.SerialNumber, this.entity_id);
	
	this.getService(Service.Switch)
		.getCharacteristic(Characteristic.On)
		.getValue();
};


//Service.Switch = function(displayName, subtype) {
  //Service.call(this, displayName, '00000049-0000-1000-8000-0026BB765291', subtype);

  // Required Characteristics
  //this.addCharacteristic(Characteristic.On);

  // Optional Characteristics
  //this.addOptionalCharacteristic(Characteristic.Name);
//};

//inherits(Service.Switch, Service);

//Service.Switch.UUID = '00000049-0000-1000-8000-0026BB765291';
