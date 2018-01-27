var LifxClient = require('node-lifx').Client;
var LifxUtil = require('node-lifx').utils
var client = new LifxClient();
var lights = []


var lightManager = (function() {
	
	client.on('light-new', function(light) {
		lights.push(light)
		light.getState(function(error, data) {
			if(error != null) {
				console.log("error getting light state")
				return
			}
			light.custom_name = data.label
			light.custom_hue = data.color.hue
			light.custom_saturation = data.color.saturation
			light.custom_brightness = data.color.brightness
			light.custom_kelvin = data.color.kelvin
		})

		light.setColorAndState = function(hue, saturation, brightness, duration, kelvin) {
			if (kelvin == null) { kelvin = this.custom_kelvin }
			if (duration == null) { duration = 0 }
			if (hue == null) { hue = this.custom_hue }
			if (saturation == null) { saturation = this.custom_saturation }
			if (brightness == null) {brightness = this.custom_brightness}

			this.color(hue, saturation, brightness, kelvin, duration)
			this.custom_brightness = brightness
			this.custom_hue = hue
			this.custom_saturation = saturation
			this.custom_kelvin = kelvin
		}

		setInterval( function(){
			lights.forEach(function(light) {
				light.getState(function(error, data) {
					if(error != null) {
						console.log("Error getting light state for light " + light.custom_name + ". " + error)
					} else if (data != null) {
						light.custom_hue = data.color.hue
						light.custom_brightness = data.color.brightness
						light.custom_saturation = data.color.saturation
						light.custom_kelvin = data.color.kelvin
					}
				})
			})
		}, 10000)
	});

	client.init();
})()

var setColorForAllLights = function(hue, saturation, brightness, duration, kelvin, callback) {
	if(duration == null) duration = 0
	for(var i = 0; i < lights.length; i++)  {
		lights[i].setColorAndState(hue, saturation, brightness, duration, kelvin)
	}
}

var setColorForLightByName = function(name, hue, saturation, brightness, duration, kelvin, callback) {
	if(duration == null) duration = 0
	for(var i = 0; i < lights.length; i++)  {
		if(lights[i].custom_name == name) {
			lights[i].setColorAndState(hue, saturation, brightness, duration, kelvin)
		}
	}
}

var setBrightnessForLightByName = function(name, brightness, duration) {
	if(duration == null) duration = 0
	for(var i = 0; i < lights.length; i++)  {
		if(lights[i].custom_name == name) {
			lights[i].setColorAndState(lights[i].custom_hue, lights[i].custom_saturation, brightness, duration, lights[i].custom_kelvin)
		}
	}
}

var getLightByName = function(name) {
	for(var i = 0; i < lights.length; i++)  {
		if(lights[i].custom_name == name) {
			return lights[i]
		}
	}
	return null
}

var addColorForAllLights = function(hue, saturation, brightness, duration, kelvin, callback) {
	if(duration == null) duration = 0
	for(var i = 0; i < lights.length; i++)  {
		var newHue = lights[i].custom_hue + hue
		newHue = clampValue(newHue, 0, 360)
		var newSaturation = lights[i].custom_saturation + saturation
		newSaturation = clampValue(newSaturation, 0, 100)
		var newBrightness = lights[i].custom_brightness + brightness
		newBrightness = clampValue(newBrightness, 0, 100)
		var newKelvin = lights[i].custom_kelvin
		if(newKelvin == null) newKelvin = 3500
		if(newKelvin < 5000) newKelvin += kelvin * 0.5
		else newKelvin += kelvin
		
		newKelvin = clampValue(newKelvin, 2500, 9000)
		lights[i].setColorAndState(newHue, newSaturation, newBrightness, duration, newKelvin)
	}
}

var setHexColorForAllLights = function(hexCode, duration, callback) {
	var hsb = LifxUtil.rgbToHsb(LifxUtil.rgbHexStringToObject(hexCode))
	setColorForAllLights(hsb.h, hsb.s, null, duration, 3500, callback)
}

var setBrightnessForAllLights = function(brightness) {
	setColorForAllLights(null, null, brightness, null, null, null)
}

var setLightsPowerStatus = function(lightNames, on) {
	lights.forEach(function(light) {
		lightNames.forEach(function(lightName) {
			if(light.custom_name == lightName) {
				if(on) {
					light.on(500)
				} else {
					light.off(500)
				}
			}
		})		
	})
}

var setAllLightsPowerStatus = function(on) {
	lights.forEach(function(light) {
		if(on) {
			light.on(500)
		} else {
			light.off(500)
		}	
	})
}

var getLightSnapshots = function() {
	var lightSnapshotArray = []
	for (var i = 0; i < lights.length; i++) {
		lightSnapshotArray.push(new lightSnapshot(lights[i].custom_brightness, lights[i].custom_hue, lights[i].custom_saturation, lights[i].custom_kelvin))
	}
	return lightSnapshotArray
}

var savedStates = {}

var saveLightsState = function(saveName) {
	savedStates[saveName] = getLightSnapshots()
}

var setLivingroomColor = function(hue, saturation, brightness, kelvin, duration) {
	livingRoomLights.forEach(function(lightName) {
		setColorForLightByName(lightName, hue, saturation, brightness, duration, kelvin, null)
	})
}

var loadLightsState = function(saveName) {
	var lightSnapshotArray = savedStates[saveName]
	for (var i = 0; i < lightSnapshotArray.length; i++) {
		var lightSnapshot = lightSnapshotArray[i]
		var newHue = lightSnapshot.hue
		var newSaturation = lightSnapshot.saturation
		var newBrightness = lightSnapshot.brightness
		var newKelvin = lightSnapshot.kelvin

		lights[i].setColorAndState(newHue, newSaturation, newBrightness, 500, newKelvin)
	}
}

var lightSnapshot = function(brightness, hue, saturation, kelvin) {
	this.brightness = brightness
	this.hue = hue
	this.saturation = saturation
	this.kelvin = kelvin
}

var clampValue = function(val, min, max) {
	if(val < min) return min
	if(val > max) return max
	return val
}

var isRotatingColors = false
var lightTimout = null

var startRotatingColors = function(duration, delay) {
	if (!isRotatingColors && !djManager.isListening()) {
		isRotatingColors = true
		rotateColors(duration, delay, false)
	}
}

var stopRotatingColors = function() {
	isRotatingColors = false
	if (lightTimout != null) {
		clearTimeout(lightTimout) 
		lightTimout = null
	}
}

var livingRoomLights = ["Tall Lamp", "Table Lamp", "Shade Cylinder", "Kitchen", "Entrance"]

var rotateColors = function(duration, delay, onlyOnce) {
	if (isRotatingColors || onlyOnce) {
		
		var tallLamp = getLightByName("Tall Lamp")
		var tableLamp = getLightByName("Table Lamp")
		var shadeLamp = getLightByName("Shade Cylinder")
		var kitchenLamp = getLightByName("Kitchen")
		var entranceLamp = getLightByName("Entrance")

		var cHue = tallLamp.custom_hue
		var cSat = tallLamp.custom_saturation
		var cBri = tallLamp.custom_brightness
		var cKel = tallLamp.custom_kelvin

		tallLamp.setColorAndState(tableLamp.custom_hue, tableLamp.custom_saturation, tableLamp.custom_brightness, duration, tableLamp.custom_kelvin)

		tableLamp.setColorAndState(shadeLamp.custom_hue, shadeLamp.custom_saturation, shadeLamp.custom_brightness, duration, shadeLamp.custom_kelvin)

		shadeLamp.setColorAndState(kitchenLamp.custom_hue, kitchenLamp.custom_saturation, kitchenLamp.custom_brightness, duration, kitchenLamp.custom_kelvin)

		kitchenLamp.setColorAndState(entranceLamp.custom_hue, entranceLamp.custom_saturation, entranceLamp.custom_brightness, duration, entranceLamp.custom_kelvin)

		entranceLamp.setColorAndState(cHue, cSat, cBri, duration, cKel)

		if (!onlyOnce) {
			lightTimout = setTimeout(function() {
				rotateColors(duration, delay, false)
			}, duration + delay)
		}
	}
}

exports.manager = lightManager
exports.setColorForAllLights = setColorForAllLights
exports.setHexColorForAllLights = setHexColorForAllLights
exports.setBrightnessForAllLights = setBrightnessForAllLights
exports.addColorForAllLights = addColorForAllLights
exports.setColorForLightByName = setColorForLightByName
exports.setLightsPowerStatus = setLightsPowerStatus
exports.setAllLightsPowerStatus = setAllLightsPowerStatus
exports.saveLightsState = saveLightsState
exports.loadLightsState = loadLightsState
exports.startRotatingColors = startRotatingColors
exports.stopRotatingColors = stopRotatingColors
exports.setBrightnessForLightByName = setBrightnessForLightByName
exports.setLivingroomColor = setLivingroomColor
exports.rotateColors = rotateColors

var djManager = require('./djManager')

/**
Tall Lamp
Table Lamp
Bed Light
Shade Cylinder
Entrance
Kitchen
*/