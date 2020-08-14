const Discord = require('discord.js');

const fetch = require('node-fetch');
const sharp = require('sharp');
const cron = require('node-cron');

const shared = require('../../util/shared_var');
const config = require('../../util/config_loader');

/**
 * Get APOD, overlay Image and set guild logo
 *
 * @param {*} guild_id, ID of guild thats logo it is to set
 */
async function set_guild_logo_to_apod(guild_id) {
	let apod_obj;
	while (true) {
		/**
		 * If there is no APOD for the date currently try every hour until there is
		 */
		try {
			// If fetching the APOD succeeds break loop
			// Calculate TimeZoneOffset in ms to get correct Date
			let time_zone_offset = new Date().getTimezoneOffset() * 60000;
			apod_obj = await get_apod(
				new Date(Date.now() - time_zone_offset).toISOString().split('T')[0]
			);

			break;
		} catch (e) {
			// Wait for 60 minutes an loop again
			console.log(
				`[${new Date().toISOString()}]: APOD could not be fetched. Retrying in 60 minutes.`
			);
			await new Promise((resolve) => setTimeout(resolve, 60 * 60 * 1000));
		}
	}

	send_apod_info(guild_id, apod_obj.json, apod_obj.img);
	if (apod_obj.json.media_type == 'image') {
		let processed_img = await create_guild_logo(apod_obj.img);
		shared.get('Client').guilds.cache.get(guild_id).setIcon(processed_img);
	}
}

/**
 * Return a scheduled task, that only has to be started
 *
 * @param {*} guild_id
 */
function get_cron_task(guild_id) {
	return cron.schedule('0 0 * * *', () => set_guild_logo_to_apod(guild_id), {
		scheduled: false,
	});
}

/**
 *  Returns Obj containing APOD JSON and APOD image, if there is one
 *
 * @param {String} date, Date of the APOD
 */
async function get_apod(date) {
	// Build URL for API request
	let url = `https://api.nasa.gov/planetary/apod?api_key=${config.get(
		'nasa-apod/api-key'
	)}&date=${date}&hd=true`;

	let settings = { method: 'Get' };

	// Fetch NASA APOD JSON
	let apod_json;
	await fetch(url, settings)
		.then((res) => res.json())
		.then((json) => {
			apod_json = json;
		});

	if (apod_json.code != undefined) {
		throw 'No APOD available';
	}

	// Fetch (at least try to fetch) NASA APOD
	let img_buffer;
	await fetch(apod_json.url)
		.then((res) => res.buffer())
		.then((buffer) => {
			img_buffer = buffer;
		});

	// Return said object (see method comment)
	return { json: apod_json, img: img_buffer };
}

/**
 * Crops image to 500x500 and overlays a PNG File at path specified in config.toml
 *
 * @param {*} img_buffer
 */
async function create_guild_logo(img_buffer) {
	let sharp_instance = sharp(img_buffer);

	// Get width and height to crop image to largest possible 1x1 ratio
	let dim;
	await sharp_instance.metadata().then((metadata) => {
		dim = Math.min(metadata.width, metadata.height);
	});

	let path = config.get('nasa-apod/overlay-path');
	// Get path into right format => ./path/.../file.extension
	path =
		path.match(/^\.\//) != null
			? path
			: path.match(/^\//)
			? `.${path}`
			: `./${path}`;

	/**
	 * - Resize to 1x1 ratio
	 * - Resize to 500x500px
	 * - Overlay image
	 * - Write back to buffer
	 */
	await sharp_instance
		.resize({ width: dim, height: dim })
		.resize({ width: 500, height: 500 })
		.composite([
			{
				input: path,
				gravity: 'center',
			},
		])
		.toBuffer()
		.then((buffer) => {
			img_buffer = buffer;
		});

	return img_buffer;
}

/**
 *	Sends a message embed containing info about
 *  the APOD to the system channel of the given guild
 *
 * @param {Discord.message} message
 * @param {*} apod_json, json returned by apod api
 * @param {*} img_buffer, apod img, if there is an image today
 */
async function send_apod_info(guild_id, apod_json, img_buffer) {
	if (apod_json.media_type == 'image') {
		// Message Embed containing info and the today's apod
		const file = new Discord.MessageAttachment(img_buffer, 'apod.jpg');
		const answer = new Discord.MessageEmbed()
			.setColor(config.get('colors/embed/color'))
			.setTitle("The following APOD is today's css logo.")
			.setDescription(`__**${apod_json.title}**__\n${apod_json.explanation}`)
			.setImage('attachment://apod.jpg')
			.setTimestamp(apod_json.date)
			.setFooter(
				apod_json.copyright == undefined
					? 'No copyright information'
					: apod_json.copyright
			);

		// Sends message embed to guild's system channel
		shared
			.get('Client')
			.guilds.cache.get(guild_id)
			.systemChannel.send({ files: [file], embed: answer });
	} else {
		// Message Embed containing info that there's no apod today
		const answer = new Discord.MessageEmbed()
			.setColor(config.get('colors/embed/color'))
			.setTitle("Today's APOD is not a picture.")
			.setDescription(
				`Check back tomorrow to see if there's a new logo. For now you can check out the following APOD content:\n\n__**${apod_json.title}**__\n${apod_json.explanation}`
			)
			.setURL(apod_json.url)
			.setTimestamp(apod_json.date)
			.setFooter(
				apod_json.copyright == undefined
					? 'No copyright information'
					: apod_json.copyright
			);

		// Sends message embed to guild's system channel
		shared
			.get('Client')
			.guilds.cache.get(guild_id)
			.systemChannel.send({ embed: answer });
	}
}

module.exports = {
	get_cron_task,
};
