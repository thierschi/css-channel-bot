const Discord = require('discord.js');
const config = require('../../util/config_loader');

const cleanup = require('../msg_cleanup/msg_cleanup');

const command_map = new Map();
const help_map = new Map();

require('./ping/ping').init_commands(command_map, help_map);
require('./controls/cleanup_controls').init_commands(command_map, help_map);
require('./apod_cmds/apod_cmds').init_commands(command_map, help_map);

/**
 * Takes a message and runs the associated command
 *
 * @param {Discord.Message} msg
 */
function handle_command(msg) {
	let cmd = msg.content.slice(1);
	let cmd_arr = cmd.split(' ');

	// Run help
	if (cmd_arr[0] == 'help') {
		help(msg, cmd_arr);
		return;
	}

	try {
		command_map.get(cmd_arr[0].toLowerCase())(msg, cmd_arr);
	} catch (e) {
		console.log(
			`[Error][${new Date().toISOString()}] User ${
				msg.author.tag
			} tried to issue command \"${msg.content}\": Command not found!`
		);
	}
}

function help(msg, cmd_arr) {
	let answer;

	try {
		// Get help of command specified in cmd_arr[1]
		answer = help_map.get(cmd_arr[1]).help_embed(msg, cmd_arr);
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
	let help_arr = [];

	const help_it = help_map.keys();
	while (true) {
		let next = help_it.next();
		if (next.done) break;
		help_arr.push(next.value);
	}

	help_arr.sort();

	// Build awnser
	let answer = '__**The following help is available:**__\n\n';
	for (let cmd of help_arr) {
		answer += `> ${help_map.get(cmd).help_title} - \`${config.get(
			'server/cmd-prefix'
		)}help ${cmd}\`\n`;
	}

	return answer;
}

module.exports = {
	handle_command,
};
