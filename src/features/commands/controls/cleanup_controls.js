const Discord = require('discord.js');

const config = require('../../../util/config_loader');
const cleanup = require('../../msg_cleanup/msg_cleanup');

function run(msg, cmd_array) {
	switch (cmd_array[1]) {
		case 'clean':
			try {
				if (cmd_array[2] == undefined) cmd_array[2] = 0;
				cleanup.clean(cmd_array[2]);
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
				cleanup.ignore(cmd_array[2]);
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

function help_title() {
	return 'Message Cleanup';
}

function help_embed() {
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
	cmd_name: 'cleanup',
	run,
	help_title,
	help_embed,
};
