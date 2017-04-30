var sequence = require("./sequence").sequence

function command(data) {
	this.commandName = data.name
	this.triggerWords = data.triggerWords
	this.sequences = []
	this.priority = data.priority
	if(this.priority == null) this.priority = 0
	for(var seq in data.sequences) {
		this.sequences.push(new sequence(data.sequences[seq]))
	}
}



exports.command = command;