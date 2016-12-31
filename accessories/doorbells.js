var inherits = require('util').inherits;

var WinkAccessory, Accessory, Service, Characteristic, uuid;

/*
 *   Doorbell Accessory
 */

module.exports = function (oWinkAccessory, oAccessory, oService, oCharacteristic, ouuid) {
	if (oWinkAccessory) {
		WinkAccessory = oWinkAccessory;
		Accessory = oAccessory;
		Service = oService;
		Characteristic = oCharacteristic;
		uuid = ouuid;

		inherits(WinkDoorbellAccessory, WinkAccessory);
		WinkDoorbellAccessory.prototype.loadData = loadData;
		WinkDoorbellAccessory.prototype.deviceGroup = 'doorbells';
	}
	return WinkDoorbellAccessory;
};
module.exports.WinkDoorbellAccessory = WinkDoorbellAccessory;

function WinkDoorbellAccessory(platform, device) {
	WinkAccessory.call(this, platform, device, device.door_bell_id);

	var that = this;

	// Get Current State
	if (that.device.last_reading.button_pressed !== undefined) 
		this
			.addService(Service.Doorbell)
			.getCharacteristic(Characteristic.ProgrammableSwitchEvent)
			.on('get', function (callback) {
				callback(null, that.device.last_reading.button_pressed);
			});
	
	if (that.device.last_reading.motion !== undefined) 
		this
			.addService(Service.MotionSensor)
			.getCharacteristic(Characteristic.MotionDetected)
			.on('get', function (callback) {
				callback(null, that.device.last_reading.motion);
			});
	
	this.loadData();
}

var loadData = function () {
	if (this.device.last_reading.button_pressed !== undefined) 
		this.getService(Service.Doorbell)
			.getCharacteristic(Characteristic.ProgrammableSwitchEvent)
			.getValue();
	if (this.device.last_reading.motion !== undefined) 
		this.getService(Service.MotionSensor)
			.getCharacteristic(Characteristic.MotionDetected)
			.getValue();

	
};



//Service.Doorbell = function(displayName, subtype) {
  //Service.call(this, displayName, '00000121-0000-1000-8000-0026BB765291', subtype);

  // Required Characteristics
  //this.addCharacteristic(Characteristic.ProgrammableSwitchEvent);

  // Optional Characteristics
  //this.addOptionalCharacteristic(Characteristic.Brightness);
  //this.addOptionalCharacteristic(Characteristic.Volume);
  //this.addOptionalCharacteristic(Characteristic.Name);
//};

//inherits(Service.Doorbell, Service);

//Service.Doorbell.UUID = '00000121-0000-1000-8000-0026BB765291';
