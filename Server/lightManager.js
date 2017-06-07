var LifxClient = require('node-lifx').Client;
var LifxUtil = require('node-lifx').utils
var client = new LifxClient();
var lights = []

var lightManager = (function() {
	
	client.on('light-new', function(light) {
		lights.custom_hue
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
		})
	});

	client.init();
	console.log("light manager instance")
})()

var setColorForAllLights = function(hue, saturation, brightness, duration, kelvin, callback) {
	if(duration == null) duration = 0
	for(var i = 0; i < lights.length; i++)  {
		var newHue = hue
		if(newHue == null) newHue = lights[i].custom_hue
		var newSaturation = saturation
		if(newSaturation == null) newSaturation = lights[i].custom_saturation
		var newBrightness = brightness
		if(newBrightness == null) newBrightness = lights[i].custom_brightness
		var newKelvin = kelvin
		if(newKelvin == null) newKelvin = lights[i].custom_kelvin
		if(newKelvin == null) newKelvin = 3500

		lights[i].color(newHue, newSaturation, newBrightness, newKelvin, duration)
		lights[i].custom_brightness = newBrightness
		lights[i].custom_hue = newHue
		lights[i].custom_saturation = newSaturation
		lights[i].custom_kelvin = newKelvin
	}
}

var setColorForLightByName = function(name, hue, saturation, brightness, duration, kelvin, callback) {
	if(duration == null) duration = 0
	for(var i = 0; i < lights.length; i++)  {
		if(lights[i].custom_name == name) {
			var newHue = hue
			if(newHue == null) newHue = lights[i].custom_hue
			var newSaturation = saturation
			if(newSaturation == null) newSaturation = lights[i].custom_saturation
			var newBrightness = brightness
			if(newBrightness == null) newBrightness = lights[i].custom_brightness
			var newKelvin = kelvin
			if(newKelvin == null) newKelvin = lights[i].custom_kelvin
			if(newKelvin == null) newKelvin = 3500

			lights[i].color(newHue, newSaturation, newBrightness, newKelvin, duration)
			lights[i].custom_brightness = newBrightness
			lights[i].custom_hue = newHue
			lights[i].custom_saturation = newSaturation
			lights[i].custom_kelvin = newKelvin
		}
	}
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
		newKelvin += kelvin
		newKelvin = clampValue(newKelvin, 2500, 9000)
		lights[i].color(newHue, newSaturation, newBrightness, newKelvin, duration)
		lights[i].custom_brightness = newBrightness
		lights[i].custom_hue = newHue
		lights[i].custom_saturation = newSaturation
		lights[i].custom_kelvin = newKelvin
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

// var getLightSnapshots = function() {
// 	var lightSnapshotArray = []
// 	for (var i = 0; i < lights.length, i++) {
// 		lightSnapshotArray.push(new lightSnapshot(lights[i].custom_brightness), lights[i].custom_hue, lights[i].custom_saturation, lights[i].custom_kelvin)
// 	}
// 	return lightSnapshotArray
// }

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

exports.manager = lightManager
exports.setColorForAllLights = setColorForAllLights
exports.setHexColorForAllLights = setHexColorForAllLights
exports.setBrightnessForAllLights = setBrightnessForAllLights
exports.addColorForAllLights = addColorForAllLights
exports.setColorForLightByName = setColorForLightByName
exports.setLightsPowerStatus = setLightsPowerStatus
exports.setAllLightsPowerStatus = setAllLightsPowerStatus


/**
Tall Lamp
Table Lamp
Bed Light
Shade Cylinder
Entrance
Kitchen
*/