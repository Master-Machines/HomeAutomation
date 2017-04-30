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
	console.log("Setting color with hex code: " + hexCode)
	var hsb = LifxUtil.rgbToHsb(LifxUtil.rgbHexStringToObject(hexCode))
	setColorForAllLights(hsb.h, hsb.s, 30, duration, 3500, callback)
}

var setBrightnessForAllLights = function(brightness) {
	console.log("setting brightness: " + brightness)
	setColorForAllLights(null, null, brightness, null, null, null)
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