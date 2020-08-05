const Discord = require('discord.js');
const config = require('../../util/config_loader');
const commands = new Map();
const cleanup = require('../msg_cleanup/msg_cleanup');

commands.set(require('./ping/ping').cmd_name, require('./ping/ping'));
commands.set(
	require('./controls/cleanup_controls').cmd_name,
	require('./controls/cleanup_controls')
);
console.log(commands);

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
	}
}

function help(msg, cmd_arr) {
	var answer;

	try {
		// Get help of command specified in cmd_arr[1]
		answer = commands.get(cmd_arr[1]).help_embed();
	} catch (e) {
		// Or get a help overview
		// console.log(e);
		answer = help_overview();
	}

	msg.channel.send(answer).then((sent) => {
		cleanup.add(msg, sent);
	});
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
	var answer = '__**The following help is available:**__\n\n';
	for (var cmd of command_arr) {
		answer += `> ${commands.get(cmd).help_title()} - \`!help ${cmd}\`\n`;
	}

	return answer;
}

module.exports = {
	handle_command,
};
