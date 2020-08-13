const config = require('../util/config_loader');
const command_handler = require('./commands/command_handler');
const cleanup = require('./msg_cleanup/msg_cleanup');
const Discord = require('discord.js');
const cron = require('node-cron');

const apod = require('./nasa_apod/nasa_apod');
const shared_var = require('../util/shared_var');

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

		const sheduled_tasks = [
			apod.get_cron_task(config.get('nasa-apod/guild-id')),
		];

		sheduled_tasks.forEach((task) => {
			task.start();
			console.log(
				`[Info][${new Date().toISOString()}]: A task has been sheduled.`
			);
		});
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
