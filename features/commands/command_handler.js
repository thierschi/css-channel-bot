const Discord = require('discord.js');
const config = require('../../util/config_loader');
const commands = new Map();

commands.set('ping', require('./ping/ping'));

/**
 * Takes a message and runs the command
 *
 * @param {Discord.Message} msg
 */
function handle_command(msg) {
	var command = msg.content.slice(1);
	var command_arr = command.split(' ');

	// Run help
	if (command_arr[0] == 'help') {
		help(msg, command_arr);
		return;
	}

	try {
		commands.get(command_arr[0].toLowerCase()).run(msg, command_arr);
	} catch (e) {
		console.error(
			`[Error] User ${msg.author.tag} tried to issue command \"${msg.content}\": Command not found!`
		);
		console.log(e);
		// For debugging
	}
}

function help(msg, cmd_arr) {
	var answer;

	try {
		// Get help of command specified in cmd_arr[1]
		answer = commands.get(cmd_arr[1]).help();
	} catch (e) {
		// Or get a help overview
		answer = help_overview();
	}

	msg.channel.send(answer);
}

function help_overview() {
	// Get a list of all keys of the commands map => the command keywords
	var command_arr = [];
	const command_iterator = commands.keys();
	while (true) {
		let next = command_iterator.next();
		if (next.done) break;
		command_arr.push(next.value);
	}

	command_arr.sort();

	// Build awnser
	var answer = '**The following help is available:**\n';
	for (var cmd of command_arr) {
		answer += '`!help ' + cmd + '`\n';
	}

	return answer;
}

module.exports = {
	handle_command,
};
