const Discord = require('discord.js');
const shared = require('../../../util/shared_var');
const config = require('../../../util/config_loader');

/**
 *	Reply to !ping with Pong and elapsed Time
 *
 * @param {Discord.Message} command
 * @param {string[]} cmd_arr
 */
function run(msg, cmd_arr) {
	msg.channel.send('Pong!').then((sent) => {
		var sf_rec = Discord.SnowflakeUtil.deconstruct(msg.id);
		var sf_sen = Discord.SnowflakeUtil.deconstruct(sent.id);

		/**
		 * Calculate elapsed ping of user, by the difference in the timestamps
		 * of sent and recieved message and subtract the bots ping
		 */
		var elapsed = Math.abs(
			sf_sen.timestamp - sf_rec.timestamp - shared.get('Client').ws.ping
		);
		sent.edit(`Pong! (Elapsed Time: ${elapsed}ms)`);

		// Delete message for decluttering in chats
		msg.delete({ timeout: 2500 });
		sent.delete({ timeout: 5000 });
	});
}

function help_title() {
	return 'Ping';
}

function help_embed() {
	const answer = new Discord.MessageEmbed()
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

	return answer;
}

module.exports = {
	cmd_name: 'ping',
	run,
	help_title,
	help_embed,
};
