var wink = require('wink-jsv2');
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

		inherits(WinkSecurityAccessory, WinkAccessory);
		WinkSecurityAccessory.prototype.loadData = loadData;
		WinkSecurityAccessory.prototype.deviceGroup = 'securitysystem';
	}
	return WinkSecurityAccessory;
};
module.exports.WinkSecurityAccessory = WinkSecurityAccessory;

function WinkSecurityAccessory(platform, device) {
	WinkAccessory.call(this, platform, device, device.camera_id);


	var that = this;
		
		this
			.addService(Service.SecuritySystem)
			.getCharacteristic(Characteristic.SecuritySystemCurrentState)
			.on('get', function (callback) {
				switch (that.device.last_reading.mode) {
					case "away":
						callback(null, Characteristic.SecuritySystemCurrentState.AWAY_ARM);
						break;
					case "night":
						callback(null, Characteristic.SecuritySystemCurrentState.NIGHT_ARM);
						break;
					case "home":
						callback(null, Characteristic.SecuritySystemCurrentState.STAY_ARM);
						break;
					default:
						callback(null, Characteristic.SecuritySystemCurrentState.DISARMED);
						break;
			}
		}
		)
		;


		this
			.getService(Service.SecuritySystem)
			.getCharacteristic(Characteristic.SecuritySystemTargetState)

// GET TARGET STATE

//			.on('get', function (callback) {
//				callback(null, that.device.desired_state.mode);
//			})

//				.on('get', function (callback) {
//				if (that.device.desired_state.mode === "away")
//						callback(null, Characteristic.SecuritySystemTargetState.AWAY_ARM);
//				else if (that.device.desired_state.mode === "night")
//						callback(null, Characteristic.SecuritySystemTargetState.NIGHT_ARM);
//				else if (that.device.desired_state.mode === "home")
//						callback(null, Characteristic.SecuritySystemTargetState.STAY_ARM);
//				else
//						callback(null, Characteristic.SecuritySystemTargetState.DISARMED);
//			}
//		)


				.on('get', function (callback) {
				switch (that.device.desired_state.mode) {
					case "home":
						callback(null, Characteristic.SecuritySystemTargetState.STAY_ARM);
						break;
					case "away":
						callback(null, Characteristic.SecuritySystemTargetState.AWAY_ARM);
						break;
					case "night":
						callback(null, Characteristic.SecuritySystemTargetState.NIGHT_ARM);
						break;
					default:
						callback(null, Characteristic.SecuritySystemTargetState.DISARMED);
						break;
			}
		}
		)
		

//SET TARGET STATE


//			.on('set', function (value, callback) {
//				console.log("Canary currenlty set to", that.device.last_reading.mode),
//				console.log("Setting Canary to", value),
//				that.updateWinkProperty(callback, "mode", value),
//				console.log("Canary set to", that.device.desired_state.mode);
//			}
//			)
//			;

			.on('set', function (value, callback) { 
				console.log("Canary currently set to", that.device.last_reading.mode)
				console.log("Set Canary to", value)
				switch (value) {
				case 2:
					console.log("Setting Canary to Night"),
//					callback(null, that.device.desired_state.mode.night)
					that.updateWinkProperty(callback, "mode", "night");
//					wink.device_group(this.deviceGroup).device_id(this.deviceId).update.mode.night;
//					var request = require('request');
//					var dataString = '{ "desired_state": { "mode": "night" } }';
//					var options = {
//   					url: '\https://winkapi.quirky.com/cameras/42926/desired_state',
//    					method: 'PUT',
//    					body: dataString
//						};
//					function callback(error, response, body) {
//    				if (!error && response.statusCode == 200) {
//       			 	console.log(body);
//    				}
//					}
//					request(options, callback);
					break;
				case 1:
					console.log("Setting Canary to Away"),
//					callback(null, that.device.desired_state.mode.away)
					that.updateWinkProperty(callback, "mode", "away");
//					wink.device_group(this.deviceGroup).device_id(this.deviceId).update.mode.away;
//					var request = require('request');
//					var dataString = '{ "desired_state": { "mode": "away" } }';
//					var options = {
//    					url: '\https://winkapi.quirky.com/cameras/42926/desired_state',
//    					method: 'PUT',
//    					body: dataString
//						};
//					function callback(error, response, body) {
//    				if (!error && response.statusCode == 200) {
//       			 	console.log(body);
//    				}
//					}
//					request(options, callback);
//					break;
					break;
				case 0:
					console.log("Setting Canary to Home"),
//					callback(null, that.device.desired_state.mode.home)
					that.updateWinkProperty(callback, "mode", "home");
//					wink.device_group(this.deviceGroup).device_id(this.deviceId).update.mode.home;
//					var request = require('request');
//					var dataString = '{ "desired_state": { "mode": "home" } }';
//					var options = {
//    					url: '\https://winkapi.quirky.com/cameras/42926/desired_state',
//    					method: 'PUT',
//    					body: dataString
//						};
//					function callback(error, response, body) {
//    				if (!error && response.statusCode == 200) {
//       			 	console.log(body);
//    				}
//					}
//					request(options, callback);
					break; 
				}
				console.log("Canary State = ", that.device.desired_state.mode)	
				}
				)

//			.on('set', function (callback) {
//			switch (that.device.desired_state.desired_mode) {
//				case Characteristic.SecuritySystemTargetState.STAY_ARM:
//					that.updateWinkProperty(callback, ["mode", "private"], ["home", false]);
//					break;
//				case Characteristic.SecuritySystemTargetState.AWAY_ARM:
//					that.updateWinkProperty(callback, ["mode", "private"], ["away", false]);
//					break;
//				case Characteristic.SecuritySystemTargetState.NIGHT_ARM:
//					that.updateWinkProperty(callback, ["mode", "private"], ["night", false]);
//					break;
//			}
//			}
//			)

//					.on('set', function (value, callback) {
//			switch (value) {
//				case Characteristic.SecuritySystemTargetState.STAY_ARM:
//					that.updateWinkProperty(callback, "mode", "home");
//					break
//				case Characteristic.SecuritySystemTargetState.AWAY_ARM:
//					that.updateWinkProperty(callback, "mode", "away");
//					break;
//				case Characteristic.SecuritySystemTargetState.NIGHT_ARM:
//					that.updateWinkProperty(callback, "mode", "night");
//					break;
//			}
//			}
//			)

			;

	this.loadData();
}

var loadData = function () {
	 this.getService(Service.AccessoryInformation)
          .setCharacteristic(Characteristic.Manufacturer, this.device.device_manufacturer)
          .setCharacteristic(Characteristic.Model, this.device.model_name)
          .setCharacteristic(Characteristic.SerialNumber, this.entity_id);
	
	this.getService(Service.SecuritySystem)
		.getCharacteristic(Characteristic.SecuritySystemCurrentState)
		.getValue();

	this.getService(Service.SecuritySystem)
		.getCharacteristic(Characteristic.SecuritySystemTargetState)
		.getValue();
};


//Service.SecuritySystem = function(displayName, subtype) {
  //Service.call(this, displayName, '0000007E-0000-1000-8000-0026BB765291', subtype);

  // Required Characteristics
  //this.addCharacteristic(Characteristic.SecuritySystemCurrentState);
  //this.addCharacteristic(Characteristic.SecuritySystemTargetState);

  // Optional Characteristics
  //this.addOptionalCharacteristic(Characteristic.StatusFault);
  //this.addOptionalCharacteristic(Characteristic.StatusTampered);
  //this.addOptionalCharacteristic(Characteristic.SecuritySystemAlarmType);
  //this.addOptionalCharacteristic(Characteristic.Name);
//};

//inherits(Service.SecuritySystem, Service);

//Service.SecuritySystem.UUID = '0000007E-0000-1000-8000-0026BB765291';

//Characteristic.SecuritySystemCurrentState = function() {
  //Characteristic.call(this, 'Security System Current State', '00000066-0000-1000-8000-0026BB765291');
  //this.setProps({
   // format: Characteristic.Formats.UINT8,
   // perms: [Characteristic.Perms.READ, Characteristic.Perms.NOTIFY]
 // });
  //this.value = this.getDefaultValue();
//};

//inherits(Characteristic.SecuritySystemCurrentState, Characteristic);

//Characteristic.SecuritySystemCurrentState.UUID = '00000066-0000-1000-8000-0026BB765291';

// The value property of SecuritySystemCurrentState must be one of the following:
//Characteristic.SecuritySystemCurrentState.STAY_ARM = 0;
//Characteristic.SecuritySystemCurrentState.AWAY_ARM = 1;
//Characteristic.SecuritySystemCurrentState.NIGHT_ARM = 2;
//Characteristic.SecuritySystemCurrentState.DISARMED = 3;
//Characteristic.SecuritySystemCurrentState.ALARM_TRIGGERED = 4;

/**
 * Characteristic "Security System Target State"
 */

//Characteristic.SecuritySystemTargetState = function() {
  //Characteristic.call(this, 'Security System Target State', '00000067-0000-1000-8000-0026BB765291');
  //this.setProps({
    //format: Characteristic.Formats.UINT8,
    //perms: [Characteristic.Perms.READ, Characteristic.Perms.WRITE, Characteristic.Perms.NOTIFY]
  //});
  //this.value = this.getDefaultValue();
//};

//inherits(Characteristic.SecuritySystemTargetState, Characteristic);

//Characteristic.SecuritySystemTargetState.UUID = '00000067-0000-1000-8000-0026BB765291';

// The value property of SecuritySystemTargetState must be one of the following:
//Characteristic.SecuritySystemTargetState.STAY_ARM = 0;
//Characteristic.SecuritySystemTargetState.AWAY_ARM = 1;
//Characteristic.SecuritySystemTargetState.NIGHT_ARM = 2;
//Characteristic.SecuritySystemTargetState.DISARM = 3;
