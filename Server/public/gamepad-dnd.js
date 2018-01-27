const rootUrl = window.location.origin + "/"
const btn_a = "FACE_1"
const btn_b = "FACE_2"
const btn_x = "FACE_3"
const btn_y = "FACE_4"
const btn_rb = "RIGHT_TOP_SHOULDER"
const btn_lb = "LEFT_TOP_SHOULDER"
const btn_start = "START_FORWARD"
const btn_select = "SELECT_BACK"
const btn_lt = "LEFT_BOTTOM_SHOULDER"
const btn_rt = "RIGHT_BOTTOM_SHOULDER"
const btn_left_analog = "LEFT_STICK"
const btn_right_stick = "RIGHT_STICK"
const dpad_down = "DPAD_DOWN"
const dpad_up = "DPAD_UP"
const dpad_left = "DPAD_LEFT"
const dpad_right = "DPAD_RIGHT"

var gamepad = new Gamepad();

gamepad.bind(Gamepad.Event.CONNECTED, function(device) {
	console.log("Gamepad connected")
});

gamepad.bind(Gamepad.Event.DISCONNECTED, function(device) {
	console.log("Gamepad disconnected")
});

gamepad.bind(Gamepad.Event.UNSUPPORTED, function(device) {
	console.log("Unsupported Event")
	// an unsupported gamepad connected (add new mapping)
});

gamepad.bind(Gamepad.Event.BUTTON_DOWN, function(e) {
	console.log("Button Down")
	var button = e.control
	if (button === btn_a) {
		issueCommand ("crit success")
	} else if (button === btn_x) {
		issueCommand("d20")
	} else if (button === btn_y) {
		issueCommand("high adventure")
	} else if (button === btn_b) {
		issueCommand("crit failure")
	} else if (button === btn_start) {
	} else if (button === btn_lb) {
	} else if (button === btn_rb) {
	} else if (button === btn_lt) {
	} else if (button === btn_rt) {
	} else if (button === dpad_up) {
	} else if (button === dpad_down) {
	} else if (button === btn_left_analog) {
	} else if (button === btn_right_stick) {
	} else if (button === btn_select) {
	}

	// e.control of gamepad e.gamepad pressed down
});

gamepad.bind(Gamepad.Event.BUTTON_UP, function(e) {
	console.log("Button Up")
	// e.control of gamepad e.gamepad released
});

gamepad.bind(Gamepad.Event.AXIS_CHANGED, function(e) {
	console.log("Axit Changed")
	// e.axis changed to value e.value for gamepad e.gamepad
});

gamepad.bind(Gamepad.Event.TICK, function(gamepads) {
	// gamepads were updated (around 60 times a second)
});

if (!gamepad.init()) {
	console.log("Your browser does not support gamepads, get the latest Google Chrome or Firefox")
}

var canIssue = true

var issueCommand = function(command) {
	if (canIssue) {
		canIssue = false
		setTimeout(function() {
			canIssue = true
		}, 1000)
		var commandUrl = rootUrl + "commands/play?command=" + command
		console.log(commandUrl)
		$.get(commandUrl, function(response) {
			console.log(response)
		})	
	}
	
}