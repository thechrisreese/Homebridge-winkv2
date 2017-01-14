FIRST: All Credit to KraigM for developing Homebridge-Wink. This repo is forked from him and built out for additional functions that are only valuable to a few people that want motion detection and canary status. 

SECOND: This is super beta and hacked together to try and get a bunch of additional accessories running. Please forgive the rough work, it is my test setup so I can have more motion sensors, cameras, doorbells, canary status, and water sensors running. Dont get mad if things arent perfect. Instead, help fix them! 

# Homebridge-winkv2

1. Install homebridge using: npm install -g homebridge
2. Install this plugin using: npm install -g homebridge-winkv2
3. Update your configuration file. See sample config.json snippet below. 

# Configuration

Configuration sample:

 ```
"platforms": [
		{
			"platform": "Wink",
			"name": "Wink",
			"client_id": "YOUR_WINK_API_CLIENT_ID",
			"client_secret": "YOUR_WINK_API_CLIENT_SECRET",
			"username": "your@email.com",
			"password": "WINK_PASSWORD",
			"hide_groups": ["garage_doors", "thermostats"],
			"hide_ids": []
			
		}
	],

```

Fields: 

* "platform": Must always be "Wink" (required)
* "name": Can be anything (required)
* "client_id": Wink API client id, must be obtained from questions@wink.com (required)
* "client_secret": Wink API client id, must be obtained from questions@wink.com (required)
* "username": Wink login username, same as app (required)
* "password": Wink login password, same as app (required)
* "hide_groups": List of Wink groups that will be hidden from Homebridge. Accepted values are:  
  * air_contidioners  
  * binary_switches
  * cameras (currenlty only motion detection)
  * garage_doors  
  * light_bulbs  
  * locks  
  * outlets  
  * sensor_pods
  * securitysystem (currently only Canary) 
  * smoke_detectors
  * sprinklers (currently only if system is powered)
  * thermostats (updatd for Auto, somewhat problematic) 
* "hide_ids": List of Wink IDs that will be hidden from Homebrige. These ID can easily be seen in the initialization portion of homebridge.
* "temperature_unit" : Identifies the display unit for thermostats. F or C. Defaults to F
* "unregister_disconnected" : Blocks devices that are currently disconnected from the Wink hub. true/false. Defaults to true.

# Device Support

Supported Devices:

* Air Conditioners - Identifies the direct-connected Wink Aros. 
  * Change between cool, auto and off.
  * Set temperature.
  * Direct fan control is not yet available.
* Binary Switches - Z-Wave non-dimming switches, Wink Outlink, Wink Relay.
  * On/Off Functions.
  * For the Outlink, uses the power usage to determine if on or off.
  * Does not report actual power usage due to limitation in HomeKit Interface.
* Cameras
  * Motion detection
* Doorbells
  * Motion detection
* Garage Doors
  * Open/Close Wink-connected garage doors.
  * Report battery status to HomeKit.
  * Does not identify blocked doors due to limitation in Wink Interface.
* Light Bulbs - Light Bulbs and dimmable switches.
  * On/Off and Dimming.
  * Bulbs with support allow Hue and Saturation.
* Locks
  * Lock/Unlock and report current status.
  * Report Battery Status.
  * Does not support tampering due to limitation in developer's locks and possibly Wink API.
* Outlets - The controllable outlets on the Quirky Power Strip.
  * On/Off
  * Does not group the outlets by power strip due to limitation in HomeKit Interface.
* Sensor Pods - Spotter, Tripper and other PIR and Door Sensors.
  * PIR reports as Motion Detector
  * Tripper and other Door Sensors report as Doors. Tamper Detection is not available in HomeKit for these.
  * Spotter reports Temperature and Humidity to HomeKit.
  * Spotter Reports Battery Level.
  * Spotter does not report brightness, vibration or loudness to HomeKit. Apple expects values and these are simply reported as yes/no concerning if it changed.
* Security System - Canary Only
  * Get Away, Home, Night, Disarm status; Set status still being worked on.
* Smoke Detectors - I believe only Kiddie detectors are supported
  * Reports Battery Level.
  * Reports CO and Smoke Alarms as available by the detector
* Thermostats
  * Should be full functionality.
  
Not Supported Due to HomeKit Limitations

* Eggtrays - No compatible device in HomeKit
* Piggy Banks - No compatible device in HomeKit
* Hubs - Redundant the way homebridge platform plugins are designed
* Remotes - Only displays what it is linked to and doesn't allow as remote
* Buttons - The TAPT and Wink Relay buttons. I expect these are too time-delayed to be useful.
* "Unknown Devices" - Wink doesn't even know what these are.
