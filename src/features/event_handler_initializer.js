const config = require('../util/config_loader');
const command_handler = require('./commands/command_handler');
const cleanup = require('./msg_cleanup/msg_cleanup');
const Discord = require('discord.js');

/**
 * Creates all eventhadlers for a client
 *
 * @param {Discord.Client} discord_client
 */
function create_eventhandlers(discord_client) {
	discord_client.on('ready', () => {
		console.log(
			`✅ Client ${discord_client.user.username} successfully logged in.`
		);
	});

	discord_client.on('message', (msg) => {
		if (msg.guild != null) {
			if (msg.content.charAt(0) == config.get('server/cmd-prefix')) {
				command_handler.handle_command(msg);
			}
		}
	});

	cleanup.periodic_cleanup(config.get('server/cleanup-intervall'));
}

module.exports = {
	create_eventhandlers,
};
