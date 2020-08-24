const Discord = require('discord.js');

const shared = require('../../../util/shared_var');
const config = require('../../../util/config_loader');

let commands = [{ name: 'ping', function: ping }];

/**
 * Adds available commands of module to given map
 *
 * @param {Map} command_map
 * @param {Map} help_map
 */
function init_commands(command_map, help_map) {
	commands.forEach((command) => {
		command_map.set(command.name, command.function);
	});

	help_map.set('ping', {
		help_title: 'Ping',
		help_embed: help_embed,
	});

	console.log(
		`[Startup][${new Date().toISOString()}]: Initialized Ping Command.`
	);
}

/**
 *	Reply to ping with Pong and elapsed time
 *
 * @param {Discord.Message} msg
 * @param {string[]} cmd_arr
 */
function ping(msg, cmd_arr) {
	msg.channel.send('Pong!').then((sent) => {
		let sf_rec = Discord.SnowflakeUtil.deconstruct(msg.id);
		let sf_sen = Discord.SnowflakeUtil.deconstruct(sent.id);

		/**
		 * Calculate elapsed ping of user, by the difference in the timestamps
		 * of sent and recieved message and subtract the bots ping
		 */
		let elapsed = Math.abs(
			sf_sen.timestamp - sf_rec.timestamp - shared.get('Client').ws.ping
		);
		sent.edit(`Pong! (Elapsed Time: ${elapsed}ms)`);

		// Delete message for decluttering in chats
		msg.delete({ timeout: 2500 });
		sent.delete({ timeout: 5000 });
	});
}

/**
 * Returns ping help embed
 *
 * @param {*} msg
 * @param {*} cmd_arr
 */
function help_embed(msg, cmd_arr) {
	return new Discord.MessageEmbed()
		.setColor(config.get('colors/embed/color'))
		.setTitle('Message Cleanup Commands')
		.addFields(
			{
				name: 'Command',
				value:
					'`!ping` - The bot will respond with "Pong!" and an elapsed ping-time* in milliseconds will be displayd shortly after.',
			},
			{
				name: 'Notes',
				value: 'Ping messages are automatically deleted after 5 seconds.',
			}
		)
		.setFooter(
			'*Due to how the ping is estimated and due to client latencies, this ping is not too accurate.'
		);
}

module.exports = {
	init_commands,
};
