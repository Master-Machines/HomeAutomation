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
		issueCommand ("all lights on")
	} else if (button === btn_x) {
		issueCommand("kitchen power on")
	} else if (button === btn_y) {
		issueCommand("main room power on")
	} else if (button === btn_b) {
		issueCommand ("bedroom power on")
	} else if (button === btn_start) {
		issueCommand ("all lights off")
	} else if (button === btn_lb) {
		issueCommand ("incandescent")
	} else if (button === btn_rb) {
		issueCommand ("fireplace")
	} else if (button === btn_lt) {
		issueCommand ("arcade")
	} else if (button === btn_rt) {
		issueCommand ("blue ocean")
	} else if (button === dpad_up) {
		issueCommand ("increase brightness")
	} else if (button === dpad_down) {
		issueCommand ("decrease brightness")
	} else if (button === btn_left_analog) {
		issueCommand ("make colder")
	} else if (button === btn_right_stick) {
		issueCommand ("make warmer")
	} else if (button === btn_select) {
		issueCommand ("candles")
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

var issueCommand = function(command) {
	var commandUrl = rootUrl + "commands/play?command=" + command
	console.log(commandUrl)
	$.get(commandUrl, function(response) {
		console.log(response)
	})
}