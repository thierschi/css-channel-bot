const Discord = require('discord.js');

const config = require('../../../util/config_loader');
const cleanup = require('../../msg_cleanup/msg_cleanup');

let commands = [{ name: 'cleanup', function: cleanup_clean }];

/**
 * Adds available commands of module to given map
 *
 * @param {Map} command_map
 */
function init_commands(command_map, help_map) {
	commands.forEach((command) => {
		command_map.set(command.name, command.function);
	});

	help_map.set('cleanup', {
		help_title: 'Message Cleanup',
		help_embed: help_embed,
	});

	console.log(
		`[Startup][${new Date().toISOString()}]: Initialized Message Cleanup Commands.`
	);
}

/**
 * Initiates cleanup of messages
 *
 * @param {*} msg
 * @param {*} cmd_array
 */
function cleanup_clean(msg, cmd_arr) {
	switch (cmd_arr[1]) {
		case 'clean':
			try {
				if (cmd_arr[2] == undefined) cmd_arr[2] = 0;
				cleanup.clean(cmd_arr[2]);
				msg.channel
					.send('Messages have been deleted successfully!')
					.then((sent) => {
						cleanup.add(msg, sent);
					});
			} catch (e) {
				msg.channel.send(e).then((sent) => {
					cleanup.add(msg, sent);
				});
			}
			break;
		case 'ignore':
			try {
				cleanup.ignore(cmd_arr[2]);
			} catch (e) {
				msg.channel.send('An error occured.').then((sent) => {
					cleanup.add(msg, sent);
				});
			}
			break;
		default:
			cleanup.add(msg);
	}
}

/**
 * Returns help embed for cleanup controls
 *
 * @param {*} msg
 * @param {*} cmd_array
 */
function help_embed(msg, cmd_arr) {
	const answer = new Discord.MessageEmbed()
		.setColor(config.get('colors/embed/color'))
		.setTitle('Message Cleanup')
		.addFields(
			{
				name: 'Commands',
				value:
					'`!cleanup clean [period]` - Deletes all messages that are older then the period provided. Period format: [Number][Unit], with unit being d, h, min, s, ms.\n\n' +
					'`!cleanup ignore [ID of message]` - Prevent message from being deleted.*',
			},
			{
				name: 'Notes',
				value:
					'To get the ID of a message right click the message and press "Copy ID". This requires the developer mode turned on in discord.',
			}
		)
		.setFooter('*May not work.');

	return answer;
}

module.exports = {
	init_commands,
};
