const Discord = require('discord.js');

const config = require('../../../util/config_loader');
const cleanup = require('../../msg_cleanup/msg_cleanup');
const apod_handler = require('../../nasa_apod/nasa_apod');

let commands = [
	{ name: 'apod', function: apod },
	{ name: 'apodlogo', function: apod_logo },
];

/**
 * Adds available commands of module to given map
 *
 * @param {Map} command_map
 */
function init_commands(command_map, help_map) {
	commands.forEach((command) => {
		command_map.set(command.name, command.function);
	});

	help_map.set('apod', {
		help_title: 'NASA Astronomical Picture of the Day',
		help_embed: help_embed,
	});

	console.log(
		`[Startup][${new Date().toISOString()}]: Initialized Message Cleanup Commands.`
	);
}

/**
 * Sends APOD of given date
 *
 * @param {*} msg
 * @param {*} cmd_arr
 */
async function apod(msg, cmd_arr) {
	if (cmd_arr[1] == undefined) {
		let time_zone_offset = new Date().getTimezoneOffset() * 60000;
		cmd_arr[1] = new Date(Date.now() - time_zone_offset)
			.toISOString()
			.split('T')[0];
	}

	let apod_data;
	try {
		apod_data = await apod_handler.get_apod(cmd_arr[1]);
	} catch (err) {
		const answer = new Discord.MessageEmbed()
			.setColor(config.get('colors/embed/color'))
			.setTitle('Something went wrong...')
			.setDescription(err)
			.setFooter(
				`For instructions see \`${config.get('server/cmd-prefix')}help\``
			);

		msg.channel.send({ embed: answer }).then((sent) => {
			msg.delete({ timeout: 2500 });
			sent.delete({ timeout: 5000 });
		});

		return;
	}

	apod_handler
		.send_apod_info_response(msg, apod_data.json, apod_data.img)
		.then((sent) => cleanup.add(msg, sent));
}

/**
 * Sends css logo of given day
 *
 * @param {*} msg
 * @param {*} cmd_arr
 */
async function apod_logo(msg, cmd_arr) {
	if (cmd_arr[1] == undefined) {
		let time_zone_offset = new Date().getTimezoneOffset() * 60000;
		cmd_arr[1] = new Date(Date.now() - time_zone_offset)
			.toISOString()
			.split('T')[0];
	}

	let apod_data;
	try {
		apod_data = await apod_handler.get_apod(cmd_arr[1]);
	} catch (err) {
		const answer = new Discord.MessageEmbed()
			.setColor(config.get('colors/embed/color'))
			.setTitle('Something went wrong...')
			.setDescription(err)
			.setFooter(`For instructions see ${config.get('server/cmd-prefix')}help`);

		msg.channel.send({ embed: answer }).then((sent) => {
			msg.delete({ timeout: 2500 });
			sent.delete({ timeout: 5000 });
		});

		return;
	}

	let processed_img;
	if (apod_data.json.media_type == 'image')
		processed_img = await apod_handler.create_guild_logo(apod_data.img);

	apod_handler
		.send_apod_info_response(msg, apod_data.json, processed_img)
		.then((sent) => cleanup.add(msg, sent));
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
		.setTitle('NASA Astronomical Picture of the Day')
		.addFields(
			{
				name: 'Commands',
				value:
					'`!apod <Date>` - Gets NASA APOD on Date.\n\n' +
					'`!apodlogo <Date>` - Gets NASA APOD with CSS-Overlay on Date.',
			},
			{
				name: 'Date Format',
				value: `YYYY-MM-DD`,
			}
		)
		.setFooter(
			`If no Date is provided it will default to today's date. If the today's picture is not published yet, you will get an error.`
		);

	return answer;
}

module.exports = {
	init_commands,
};
