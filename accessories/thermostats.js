var inherits = require('util').inherits;

var WinkAccessory, Accessory, Service, Characteristic, uuid;

/*
 *   Thermostat Accessory
 */

module.exports = function (oWinkAccessory, oAccessory, oService, oCharacteristic, ouuid) {
	if (oWinkAccessory) {
		WinkAccessory = oWinkAccessory;
		Accessory = oAccessory;
		Service = oService;
		Characteristic = oCharacteristic;
		uuid = ouuid;

		inherits(WinkThermostatAccessory, WinkAccessory);
		WinkThermostatAccessory.prototype.loadData = loadData;
		WinkThermostatAccessory.prototype.deviceGroup = 'thermostats';
	}
	return WinkThermostatAccessory;
};
module.exports.WinkThermostatAccessory = WinkThermostatAccessory;

function WinkThermostatAccessory(platform, device) {
	WinkAccessory.call(this, platform, device, device.thermostat_id);

	var that = this;

	//Handle the Current State
	this
		.addService(Service.Thermostat)
		.getCharacteristic(Characteristic.CurrentHeatingCoolingState)
		.on('get', function (callback) {
			if (that.device.last_reading.powered) { //I need to verify this changes when the thermostat clicks on.
				switch (that.device.last_reading.mode) {
					case "cool_only":
						callback(null, Characteristic.CurrentHeatingCoolingState.COOL);
						break;
					case "heat_only":
						callback(null, Characteristic.CurrentHeatingCoolingState.HEAT);
						break;
					case "auto": //HomeKit only accepts HEAT/COOL, so we have to determine if we are Heating or Cooling.
						callback(null, Characteristic.CurrentHeatingCoolingState.AUTO);
						break;
					case "aux": //This assumes aux is always heat. Wink doesn't support aux with my thermostat even though I have aux mode, so I'm not 100%.
						callback(null, Characteristic.CurrentHeatingCoolingState.HEAT);
						break;
					default: //The above list should be inclusive, but we need to return something if they change stuff.
						callback(null, Characteristic.CurrentHeatingCoolingState.OFF);
						break;
				}
			} else //For now, powered being false means it is off
				callback(null, Characteristic.CurrentHeatingCoolingState.OFF);
		});

	//Handle the Target State
	//Handle the Current State
	this
		.getService(Service.Thermostat)
		.getCharacteristic(Characteristic.TargetHeatingCoolingState)
		.on('get', function (callback) {
			if (that.device.desired_state.powered) { //I need to verify this changes when the thermostat clicks on.
				switch (that.device.desired_state.mode) {
					case "cool_only":
						callback(null, Characteristic.TargetHeatingCoolingState.COOL);
						break;
					case "heat_only":
						callback(null, Characteristic.TargetHeatingCoolingState.HEAT);
						break;
					case "auto":
						callback(null, Characteristic.TargetHeatingCoolingState.AUTO);
						break;
					case "aux": //This assumes aux is always heat. Wink doesn't support aux with my thermostat even though I have aux mode, so I'm not 100%.
						callback(null, Characteristic.TargetHeatingCoolingState.HEAT);
						break;
					default: //The above list should be inclusive, but we need to return something if they change stuff.
						callback(null, Characteristic.TargetHeatingCoolingState.OFF);
						break;
				}
			} else //For now, powered being false means it is off
				callback(null, Characteristic.TargetHeatingCoolingState.OFF);
		})
		.on('set', function (value, callback) {
			switch (value) {
				case Characteristic.TargetHeatingCoolingState.COOL:
					that.updateWinkProperty(callback, ["mode", "powered"], ["cool_only", true]);
					break;
				case Characteristic.TargetHeatingCoolingState.HEAT:
					that.updateWinkProperty(callback, ["mode", "powered"], ["heat_only", true]);
					break;
				case Characteristic.TargetHeatingCoolingState.AUTO:
					that.updateWinkProperty(callback, ["mode", "powered"], ["auto", true]);
					break;
				case Characteristic.TargetHeatingCoolingState.OFF:
					that.updateWinkProperty(callback, "powered", false);
					break;
			}
		});

	this
		.getService(Service.Thermostat)
		.getCharacteristic(Characteristic.CurrentTemperature)
		.on('get', function (callback) {
			callback(null, that.device.last_reading.temperature);
		});

	this
		.getService(Service.Thermostat)
		.getCharacteristic(Characteristic.TargetTemperature)
		.on('get', function (callback) {
			if (Characteristic.TargetHeatingCoolingState.AUTO)
				callback (null);
			else {
				if (that.device.last_reading.heat_active)
					callback(null, that.device.desired_state.max_set_point);
				else
					callback(null, that.device.desired_state.min_set_point);
				};
		})
		.on('set', function (value, callback) {
			if (Characteristic.TargetHeatingCoolingState.AUTO)
				callback (null);
			else {
				if (that.device.last_reading.heat_active)
					that.updateWinkProperty(callback, "max_set_point", value);
				else
					that.updateWinkProperty(callback, "min_set_point", value);
			};
		});

	this
		.getService(Service.Thermostat)
		.getCharacteristic(Characteristic.TemperatureDisplayUnits)
		.on('get', function (callback) {
			if (platform.temperature_unit == "C")
				callback(null, Characteristic.TemperatureDisplayUnits.CELSIUS);
			else
				callback(null, Characteristic.TemperatureDisplayUnits.FAHRENHEIT);
		});

	this
		.getService(Service.Thermostat)
		.getCharacteristic(Characteristic.HeatingThresholdTemperature)
		.on('get', function (callback) {
			callback(null, that.device.desired_state.min_set_point);
		})
		.on('set', function (value, callback) {
			that.updateWinkProperty(callback, "min_set_point", value);
		});

	this
		.getService(Service.Thermostat)
		.getCharacteristic(Characteristic.CoolingThresholdTemperature)
		.on('get', function (callback) {
			callback(null, that.device.desired_state.max_set_point);
		})
		.on('set', function (value, callback) {
			that.updateWinkProperty(callback, "max_set_point", value);
		});




	if (that.device.last_reading.humidity !== undefined)
		this
			.getService(Service.Thermostat)
			.getCharacteristic(Characteristic.CurrentRelativeHumidity)
			.on('get', function (callback) {
				callback(null, that.device.last_reading.humidity);
			});

	//Track the Battery Level
	if (that.device.last_reading.battery !== undefined) {
		this.addService(Service.BatteryService)
			.getCharacteristic(Characteristic.BatteryLevel)
			.on('get', function (callback) {
				callback(null, Math.floor(that.device.last_reading.battery * 100));
			});

		this.getService(Service.BatteryService)
			.getCharacteristic(Characteristic.StatusLowBattery)
			.on('get', function (callback) {
				if (that.device.last_reading.battery < 0.25)
					callback(null, Characteristic.StatusLowBattery.BATTERY_LEVEL_LOW);
				else
					callback(null, Characteristic.StatusLowBattery.BATTERY_LEVEL_NORMAL);
			});

		this.getService(Service.BatteryService)
			.setCharacteristic(Characteristic.ChargingState, Characteristic.ChargingState.NOT_CHARGING);
	}
	//End Battery Level Tracking

	this.loadData();
}

var loadData = function () {
	

	this
		.getService(Service.Thermostat)
		.getCharacteristic(Characteristic.CurrentHeatingCoolingState)
		.getValue();

	this
		.getService(Service.Thermostat)
		.getCharacteristic(Characteristic.TargetHeatingCoolingState)
		.getValue();

	this
		.getService(Service.Thermostat)
		.getCharacteristic(Characteristic.CurrentTemperature)
		.getValue();

	this
		.getService(Service.Thermostat)
		.getCharacteristic(Characteristic.TargetTemperature)
		.getValue();

	this
		.getService(Service.Thermostat)
		.getCharacteristic(Characteristic.TemperatureDisplayUnits)
		.getValue();

	this
		.getService(Service.Thermostat)
		.getCharacteristic(Characteristic.HeatingThresholdTemperature)
		.getValue();

	this
		.getService(Service.Thermostat)
		.getCharacteristic(Characteristic.CoolingThresholdTemperature)
		.getValue();


	if (this.device.last_reading.humidity !== undefined)
		this
			.getService(Service.Thermostat)
			.getCharacteristic(Characteristic.CurrentRelativeHumidity)
			.getValue();

	if (this.device.last_reading.battery !== undefined) {
		this.getService(Service.BatteryService)
			.getCharacteristic(Characteristic.BatteryLevel)
			.getValue();
		this.getService(Service.BatteryService)
			.getCharacteristic(Characteristic.StatusLowBattery)
			.getValue();
	}
};



//Service.Thermostat = function(displayName, subtype) {
  //Service.call(this, displayName, '0000004A-0000-1000-8000-0026BB765291', subtype);

  // Required Characteristics
 // this.addCharacteristic(Characteristic.CurrentHeatingCoolingState);
 // this.addCharacteristic(Characteristic.TargetHeatingCoolingState);
  //this.addCharacteristic(Characteristic.CurrentTemperature);
  //this.addCharacteristic(Characteristic.TargetTemperature);
  //this.addCharacteristic(Characteristic.TemperatureDisplayUnits);

  // Optional Characteristics
 // this.addOptionalCharacteristic(Characteristic.CurrentRelativeHumidity);
 // this.addOptionalCharacteristic(Characteristic.TargetRelativeHumidity);
 // this.addOptionalCharacteristic(Characteristic.CoolingThresholdTemperature);
 // this.addOptionalCharacteristic(Characteristic.HeatingThresholdTemperature);
 // this.addOptionalCharacteristic(Characteristic.Name);

//inherits(Service.Thermostat, Service);

//Service.Thermostat.UUID = '0000004A-0000-1000-8000-0026BB765291';
