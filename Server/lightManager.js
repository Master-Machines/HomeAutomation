
var lightManager = function() {
	this.LifxClient = require('node-lifx').Client;
	this.client = new LifxClient();

	client.on('light-new', function(light) {
	  // Change light state here 
	 // light.color(100, 100, 100, 3500, 2000);
	});

	client.init();
}


module.exports = lightManager;




 
