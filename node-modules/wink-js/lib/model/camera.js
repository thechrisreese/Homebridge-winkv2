module.exports = function(data, http) {
	data.http = http;
	data.device_group = "cameras";
	data.device_id = data.camera_id;
	data.mode = {
		home: function(callback) {
			data.
			http.
			device_group(data.device_group).
			device_id(data.device_id).
			update({
				"desired_state": {
					"mode": "home"
         		}
			}, callback);
		},
		away: function(callback) {
			data.
			http.
			device_group(data.device_group).
			device_id(data.device_id).
			update({
				"desired_state": {
					"mode": "away"
         		}
			}, callback);
		},
		night: function(callback) {
			data.
			http.
			device_group(data.device_group).
			device_id(data.device_id).
			update({
				"desired_state": {
					"mode": "night"
         		}
			}, callback);
		},
		toggle: function(callback) {
			if ( data.desired_state.powered === true ) {
				this.off(callback);
			} else {
				this.on(callback);
			}
		}
	};
	
	return data;
}


/*
{
 	"light_bulb_id": "389264",
    "name": "Office",
    "locale": "en_us",
    "units": {},
    "created_at": 1425698691,
    "hidden_at": null,
    "capabilities": {},
    "triggers": [],
    "desired_state": {
        "powered": true,
        "brightness": 1
    },
    "manufacturer_device_model": "ge_",
    "manufacturer_device_id": null,
    "device_manufacturer": "ge",
    "model_name": "GE light bulb",
    "upc_id": "73",
    "hub_id": "114516",
    "local_id": "1",
    "radio_type": "zigbee",
    "linked_service_id": null,
    "last_reading": {
        "connection": true,
        "connection_updated_at": 1429354212.3576825,
        "firmware_version": "0.1b03 / 0.4b00",
        "firmware_version_updated_at": 1429354212.3577092,
        "firmware_date_code": "20140812",
        "firmware_date_code_updated_at": 1429354212.3576903,
        "powered": true,
        "powered_updated_at": 1429354212.3576972,
        "brightness": 1,
        "brightness_updated_at": 1429354212.3577034,
        "desired_powered": true,
        "desired_powered_updated_at": 1428490204.9604716,
        "desired_brightness": 1,
        "desired_brightness_updated_at": 1425698897.9915164
    },
    "lat_lng": [
        null,
        null
    ],
    "location": "",
    "order": 0
}
*/
