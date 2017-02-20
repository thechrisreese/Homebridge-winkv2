var wink = require('wink-jsV2'); 

var inherits = require('util').inherits;
var Service, Characteristic, Accessory, uuid;

module.exports = function (oAccessory, oService, oCharacteristic, ouuid) {
	if (oAccessory) {
		Accessory = oAccessory;
		Service = oService;
		Characteristic = oCharacteristic;
		uuid = ouuid;

		inherits(WinkAccessory, Accessory);
		WinkAccessory.prototype.updateWinkProperty = updateWinkProperty;
		WinkAccessory.prototype.refreshUntil = refreshUntil;
		WinkAccessory.prototype.getServices = getServices;
		WinkAccessory.prototype.handleResponse = handleResponse;
	}
	return WinkAccessory;
};
module.exports.WinkAccessory = WinkAccessory;

function WinkAccessory(platform, device, deviceId) {
	this.platform = platform;
	this.device = device;
	this.deviceId = deviceId;
	this.name = device.name;
	this.log = platform.log;

	var idKey = 'hbdev:wink:' + this.deviceGroup + ':' + this.deviceId;
	var id = uuid.generate(idKey);
	Accessory.call(this, this.name, id);
	this.uuid_base = id;

	this.control = wink.device_group(this.deviceGroup).device_id(this.deviceId);
	var that = this;

	// set some basic properties (these values are arbitrary and setting them is optional)
	this
		.getService(Service.AccessoryInformation)
		.setCharacteristic(Characteristic.Manufacturer, this.device.device_manufacturer)
		.setCharacteristic(Characteristic.Model, this.device.model_name);
		
}

var refreshUntil = function (maxTimes, predicate, callback, interval, incrementInterval, sProperty) {
	var that = this;
	if (!interval) {
		interval = 50;
	}
	if (!incrementInterval) {
		incrementInterval = 50;
	}
	setTimeout(function () {
		that.control.get(function (device) {
			that.device = device.data; //Add an error trap
			if (predicate == undefined || predicate(sProperty) == true) {
				if (callback) callback(true, that.device, sProperty);
			} else if (maxTimes > 0) {
				maxTimes = maxTimes - 1;
				interval += incrementInterval;
				that.refreshUntil(maxTimes, predicate, callback, interval, incrementInterval, sProperty);
			} else {
				if (callback) callback(false, that.device, sProperty);
			}
		});
	}, interval);
};

var updateWinkProperty = function (callback, sProperty, sTarget, bIgnoreFeedback) {
	this.log("Changing target property '" + sProperty + "' of the " + this.device.device_group + " called " + this.device.name + " to " + sTarget);
//	console.log("This Device is", this.device)
//	console.log("This Platform is", this.platform)
//	console.log("This Entity is", this.entity_id)
	console.log("From Wink", this.control)
	console.log("Wink Device Group", wink.device_group(this.deviceGroup))
	console.log("This device name", this.name)
	console.log("Thia Device Group is", this.devicegroup, this.device.devicegroup, this.device.device_group)
	console.log("This Device ID is", this.deviceid, this.device.deviceid, this.device.device_id)
	if (this.device.desired_state == undefined) {
		callback(Error("Unsupported"));
		return;
	}

	if (sProperty instanceof Array) {
		for (var i = 0; i < sProperty.length; i++) {
			if (this.device.last_reading[sProperty[i]] == undefined) {
				callback(Error("Unsupported"));
				return;
			}
		}
	} else if (this.device.last_reading[sProperty] == undefined) {
		callback(Error("Unsupported"));
		return;
	}

	if (!this.device.last_reading.connection) {
		callback(Error("Unconnected"));
		return;
	}

	var data = {
		"desired_state": {}
	};

	console.log("Line 98, sProperty is", sProperty)

	if (sProperty instanceof Array) {
		for (var i = 0; i < sProperty.length; i++) {
			data.desired_state[sProperty[i]] = sTarget[i];
			console.log("At sProperty Instanceof Array", data.desired_state[sProperty[i]]);
		}
	} else {
		data.desired_state[sProperty] = sTarget;
		console.log("Line 105, sTarget =", data.desired_state[sProperty]);
	}

	var that = this;
	var update = function (retry) {
		that.control.update(data,
			function (res) {
				var err = that.handleResponse(res);
				if (callback) {
					callback(err);
					console.log("Line 115, err =", err);
					console.log("Line 126, that.device is", that.device);
				}
			//		if (!err) {
			//		that.refreshUntil(2,
			//		function (sProperty) {
			//					console.log("Line 131, Refresh Until, that.device is", that.device)
			//					
			//					if (sProperty instanceof Array) {
			//						for (var i = 0; i < sProperty.length; i++) {
			//							var propertyName = sProperty[i];
			//							console.log("Checking last_reading of " + propertyName);
			//							if (that.device.last_reading[propertyName] === undefined || 
			//							that.device.last_reading[propertyName] === null)
			//							{
			//								console.log(sProperty + " does not exist in last_reading");
			//							}
			//							return ((that.device.last_reading[sProperty[i]] == that.device.desired_state[sProperty[i]]) || bIgnoreFeedback);
			//							console.log("Line 123, !err SProperty Array");
			//						}
			//					} else {
			//						console.log("Checking last_reading of " + sProperty)
			//
			//						if (that.device === null || that.device === undefined)
			//						{
			//							console.log("device is null");
			//						}
//
//									if (that.device.last_reading[sProperty] === undefined || 
//										that.device.last_reading[sProperty] === null)
//										{
//											console.log(sProperty + " does not exist in last_reading");
//										}
//									
//									if (that.device.last_reading[sProperty] === undefined )
//									return ((that.device.last_reading[sProperty] == that.device.desired_state[sProperty]) || bIgnoreFeedback);
//									console.log("Line 127, !err sProperty");
//								}
							
//						},
//					else
//						function (completed, device, sProperty) {
//							if (completed) {
//								that.log("Successfully changed target property '" + sProperty + "' of the " + that.device.device_group + " called " + that.device.name + " to " + sTarget);
						//	} else if (retry) {
						//		that.log("Unable to determine if update was successful. Retrying update.");
						//		retry();
//							} else {
//								that.log("Unable to determine if update was successful.");
//								err = "Unknown Issue Ecountered";
//							}
//						}
//						, 800, 150, sProperty);
//				}
			});
	};
	update(update);
};

var getServices = function () {
	return this.services;
};

var handleResponse = function (res) {
//	console.log("Line 154, Server Response", res)
	if (!res) {
		return Error("No response from Wink");
		console.log("No response from Wink");
	} else if (res.errors && res.errors.length > 0) {
		return res.errors[0];
		console.log("Line 160, res.errors");
	} else if (res.data) {
		this.device = res.data;
		if (this.loadData) this.loadData();
		console.log("Line 164, res.data");
	} 
	
};
