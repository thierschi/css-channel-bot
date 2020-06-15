const config = require('../util/config_loader');
const command_handler = require('./commands/command_handler');

function create_eventhandlers(discord_client) {
	discord_client.on('ready', () => {
		console.log(
			`Client ${discord_client.user.username} successfully logged in.`
		);
	});

	discord_client.on('message', (msg) => {
		if (msg.content.charAt(0) == config.get('server/cmd-prefix')) {
			command_handler.handle_command(msg);
		}
	});

	for (const event of [
		'exit',
		'SIGINT',
		'SIGUSR1',
		'SIGUSR2',
		'uncaughtException',
		'SIGTERM',
	]) {
		// TODO add listeners
		// process.on(event, cleanUp);
	}
}

module.exports = {
	create_eventhandlers,
};
