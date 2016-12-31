var wink = require('wink-js');
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

		inherits(WinkCameraAccessory, WinkAccessory);
		WinkCameraAccessory.prototype.loadData = loadData;
		WinkCameraAccessory.prototype.deviceGroup = 'cameras';
		
	}
	return WinkCameraAccessory;
};
function WinkCameraAccessory(platform, device) {
	WinkAccessory.call(this, platform, device, device.camera_id); 

	var that = this;
		
	
		this
				.addService(Service.MotionSensor)
				.getCharacteristic(Characteristic.MotionDetected)
				.on('get', function (callback) {
					callback(null, that.device.last_reading.motion);
				});
	
		this.loadData();
		}

var loadData = function () {
	this.getService(Service.MotionSensor)
		.getCharacteristic(Characteristic.MotionDetected)
		.getValue();
	
};




//Service.MotionSensor = function(displayName, subtype) {
  //Service.call(this, displayName, '00000085-0000-1000-8000-0026BB765291', subtype);

  // Required Characteristics
 // this.addCharacteristic(Characteristic.MotionDetected);

  // Optional Characteristics
  //this.addOptionalCharacteristic(Characteristic.StatusActive);
  //this.addOptionalCharacteristic(Characteristic.StatusFault);
  //this.addOptionalCharacteristic(Characteristic.StatusTampered);
  //this.addOptionalCharacteristic(Characteristic.StatusLowBattery);
  //this.addOptionalCharacteristic(Characteristic.Name);
//};

//inherits(Service.MotionSensor, Service);

//Service.MotionSensor.UUID = '00000085-0000-1000-8000-0026BB765291';
