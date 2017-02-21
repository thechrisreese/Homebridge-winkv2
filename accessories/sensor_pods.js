var wink = require('wink-jsv2');
var inherits = require('util').inherits;

/*
 *   Generic Accessory
 */
var WinkAccessory, Accessory, Service, Characteristic, uuid;

/*
 *   Sensor Pod Accessory
 */

module.exports = function (oWinkAccessory, oAccessory, oService, oCharacteristic, ouuid) {
	if (oWinkAccessory) {
		WinkAccessory = oWinkAccessory;
		Accessory = oAccessory;
		Service = oService;
		Characteristic = oCharacteristic;
		uuid = ouuid;

		inherits(WinkSensorAccessory, WinkAccessory);
		WinkSensorAccessory.prototype.loadData = loadData;
		WinkSensorAccessory.prototype.deviceGroup = 'sensor_pods';
	}
	return WinkSensorAccessory;
};
module.exports.WinkSensorAccessory = WinkSensorAccessory;

function WinkSensorAccessory(platform, device) {
	WinkAccessory.call(this, platform, device, device.sensor_pod_id);

	var that = this;

	//brightness <- This is change in brightness. No similar HomeKit Service.
	//external_power
	//loudness 0/1
	//vibration 0/1
	//tamper_detected true/false


	//Occupancy
	if (that.device.last_reading.occupied !== undefined) {
		this
			.addService(Service.OccupancySensor)
			.getCharacteristic(Characteristic.OccupancyDetected)
			.on('get', function (callback) {
				callback(null, that.device.last_reading.occupied);
			});
		if (that.device.last_reading.tamper_detected !== undefined)
			this
				.getService(Service.OccupancySensor)
				.getCharacteristic(Characteristic.StatusTampered)
				.on('get', function (callback) {
					callback(null, that.device.last_reading.tamper_detected);
				});
	}

	//Motion detector with PIR
	if (that.device.last_reading.motion !== undefined) {
		this
			.addService(Service.MotionSensor)
			.getCharacteristic(Characteristic.MotionDetected)
			.on('get', function (callback) {
				callback(null, that.device.last_reading.motion);
			});
		if (that.device.last_reading.tamper_detected !== undefined)
			this
				.getService(Service.MotionSensor)
				.getCharacteristic(Characteristic.StatusTampered)
				.on('get', function (callback) {
					callback(null, that.device.last_reading.tamper_detected);
				});
	}

	//Humidity Detection
	if (that.device.last_reading.humidity !== undefined)
		this
			.addService(Service.HumiditySensor)
			.getCharacteristic(Characteristic.CurrentRelativeHumidity)
			.on('get', function (callback) {
				callback(null, that.device.last_reading.humidity);
			});

	//Leak Detection
	if (that.device.last_reading.liquid_detected !== undefined)
		this
			.addService(Service.LeakSensor)
			.getCharacteristic(Characteristic.LeakDetected)
			.on('get', function (callback) {
				callback(null, that.device.last_reading.liquid_detected);
			});


	//Temperature Detection
	if (that.device.last_reading.temperature !== undefined)
		this
			.addService(Service.TemperatureSensor)
			.getCharacteristic(Characteristic.CurrentTemperature)
			.on('get', function (callback) {
				callback(null, that.device.last_reading.temperature);
			});

	//Open/Close Sensor
	if (that.device.last_reading.opened !== undefined) {
		if (platform.windowsensors.indexOf(that.deviceId) >= 0) {
			this
				.addService(Service.Window)
				.getCharacteristic(Characteristic.CurrentPosition)
				.on('get', function (callback) {
					if (that.device.last_reading.opened)
						callback(null, 100);
					else
						callback(null, 0);
				});
			this
				.getService(Service.Window)
				.setCharacteristic(Characteristic.PositionState, Characteristic.PositionState.STOPPED)			
		} else {
			this
				.addService(Service.Door)
				.getCharacteristic(Characteristic.CurrentPosition)
				.on('get', function (callback) {
					if (that.device.last_reading.opened)
						callback(null, 100);
					else
						callback(null, 0);
				});
			this
				.getService(Service.Door)
				.setCharacteristic(Characteristic.PositionState, Characteristic.PositionState.STOPPED)
		}
	}



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
	this.getService(Service.AccessoryInformation)
          .setCharacteristic(Characteristic.Manufacturer, this.device.device_manufacturer)
          .setCharacteristic(Characteristic.Model, this.device.model_name)
          .setCharacteristic(Characteristic.SerialNumber, this.entity_id);
	
	if (this.device.last_reading.battery !== undefined) {
		this.getService(Service.BatteryService)
			.getCharacteristic(Characteristic.BatteryLevel)
			.getValue();
		this.getService(Service.BatteryService)
			.getCharacteristic(Characteristic.StatusLowBattery)
			.getValue();
	}

	//Motion detector with PIR
	if (this.device.last_reading.motion !== undefined) {
		this
			.getService(Service.MotionSensor)
			.getCharacteristic(Characteristic.MotionDetected)
			.getValue();
		if (this.device.last_reading.tamper_detected !== undefined)
			this
				.getService(Service.MotionSensor)
				.getCharacteristic(Characteristic.StatusTampered)
				.getValue();
	}

	//Humidity Detection
	if (this.device.last_reading.humidity !== undefined)
		this
			.getService(Service.HumiditySensor)
			.getCharacteristic(Characteristic.CurrentRelativeHumidity)
			.getValue();

	//Temperature Detection
	if (this.device.last_reading.temperature !== undefined)
		this
			.getService(Service.TemperatureSensor)
			.getCharacteristic(Characteristic.CurrentTemperature)
			.getValue();

	//Liquid Detection
	if (this.device.last_reading.liquid_detected !== undefined)
		this
			.getService(Service.LeakSensor)
			.getCharacteristic(Characteristic.LeakDetected)
			.getValue();

	//Open/Close Sensor
	if (this.device.last_reading.opened !== undefined) {
		if (this.platform.windowsensors.indexOf(this.deviceId) >= 0) 
			this
			.getService(Service.Window)
			.getCharacteristic(Characteristic.CurrentPosition)
			.getValue();
		else
			this
			.getService(Service.Door)
			.getCharacteristic(Characteristic.CurrentPosition)
			.getValue();
	}
};
