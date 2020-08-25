# Documentation of Command Handling

> This document will show you how you can implement your own command and integrate it with the bot.
> To add a command and integrate it with the command handler your module must have the following form:

## In your module

Firstly you have to save your commands as objects containing your command (without prefix) as `name` and the associated function (as a pointer) as `function`.

```javascript
/* This array holds all commands available with your module */
let commands = [
	{ name: 'command-name-1', function: command_1_function },
	{ name: 'command-name-2', function: command_2_function },
];
```

Then you have to create a function `init_commands` which takes two maps as parameter. The first map is the command_map where commands get associated with the function that should run, when the command is issued, the second parameter is the help map which associated help for your module.

```javascript
/**
 * Adds available commands of module to given map
 * Adds help
 *
 * @param {Map} command_map
 * @param {Map} help_map
 */
function init_commands(command_map, help_map) {
	/* Here every command is taken and added to the command_map, 
    so the bot can later find the right function for a command. */
	commands.forEach((command) => {
		command_map.set(command.name, command.function);
	});

	/* Optional: If your module offers help, you can add your help
    command to your  */
	help_map.set('your_module', {
		help_title: 'Module Name',
		help_embed: help_embed, // Function that returns help
	});

	/* Optional: Log that your command has been initialized */
	console.log(
		`[Startup][${new Date().toISOString()}]: Initialized xx Command.`
	);
}
```

Functions that get associated with command should have the following signature:

```javascript
function command_1_function(msg, cmd_arr) {
	/* msg - The message which issued the command. Needed to then reply or get further data.
cmd_arr - This is an array which contains all command parameters (seperated by a space) e.g. for !cleanup clean 1s, it will be ['cleanup', 'clean', '1s'] */
	// Here your command gets run
}
```

Help functions should have the same signature as normal command functions, as they get also called with thos two parameters. This is useful if your help has extra functionality, e.g. multiple pages.

The last step is for you to export your init_commands function:

```javascript
module.exports = {
	init_commands,
};
```

## In the command handler

In order for your commands to work, you have to initialize them in the command_handler module as such:

```javascript
require('path_to_your_module').init_commands(command_map, help_map);
```
