var rootUrl = window.location.href

var commandList

var getList = function() {
	console.log(rootUrl)
	$.get(rootUrl + "commands", function(response) {
		console.log(response)
		commandList = response
		generateTable()
	})
}

var generateTable = function() {
	let index = 0
	commandList.forEach(function(commandName) {
		$('#mainTable').find('.tbody').append('<tr><td>').append("<button id='button" + index + "'>" + commandName + "</button").append('</td></tr>')
		let finalIndex = index
		$('#button' + finalIndex).click(function() {
			buttonClicked(finalIndex)
		})
		index ++
	})
}

var buttonClicked = function(index) {
	console.log("Button clicked: " + index)
	$.get(rootUrl + "commands/play?command=" + commandList[index], function(response) {

	})
}

getList()