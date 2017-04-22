
var socket = io();
var height;
var width;
var Visualizer;


// e33571 cool pink
// 5ddb3a neon green
// 9966ff purple
var colors = ['#e33571','#5ddb3a','#9966ff']


$(function() {
	height = $(window).height();
	width = $(window).width();
	Visualizer = new Visualizer(colors[randomIntFromInterval(0, colors.length -1)]);
	socket.on('update', function (data) {
	  Visualizer.updatePoints(data.buffer);
	});
	$("body").css({"background-color": '#000'});
});
// Whenever the server emits 'login', log the login message
socket.on('beat', function (data) {
  beat(data.power);
});




var beats = 0;

function beat(power) {
  beats += power;
}


// setInterval( function() {
//   var colorString =  "rgb(0," + (parseInt(255 * ( beats / 25))) + "," + (parseInt(255 * (beats / 25))) + ")";
//   $("body").css({"background-color": colorString});
//   beats *= .80;
//   beats -= 1;
//   if(beats < 0) beats = 0;
// }, 120)


function Visualizer (primaryColor) {
	this.primaryColor = primaryColor;
	this.paper = new Raphael(0, 0, width, height);
	this.createPoints(256);
	
}

Visualizer.prototype.createPoints = function(numberOfPoints) {
	this.yPosition = parseInt(height/2);
	//this.middleLine = this.paper.rect(0,this.yPosition - 1, width, 2).attr({fill : "#AAA", 'stroke-opacity' : 0})
	this.xDiff = width/numberOfPoints;
	var pathString = "M0," + this.yPosition;
	this.numberOfPoints = numberOfPoints;
	for(var i = 0; i < this.numberOfPoints; i++) {
		pathString += "L" + this.xDiff * i + ',' +  this.yPosition
	}
	this.path = this.paper.path(pathString).attr({'stroke' : this.primaryColor, 'stroke-width' : 2, 'fill' : this.primaryColor});
}

Visualizer.prototype.updatePoints = function(buffer) {
	var pathString = "M0," + this.yPosition;
	for(var i = 0; i < this.numberOfPoints; i++) {
		//pathString += "L" + this.xDiff * i + ',' +  this.yPosition;
		
		var movementAmount = parseInt(this.yPosition - buffer[i]* 3000);
		pathString += "L" + this.xDiff * i + ',' + movementAmount;
		pathString += "L" + this.xDiff * i + ',' +  this.yPosition;
	}
	pathString += "M" + width + "," + this.yPosition;
	pathString += "M0," + this.yPosition;
	this.path.attr({path :  pathString});
}


function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}