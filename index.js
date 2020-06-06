const Discord = require('discord.js');
const config = require('./util/config_loader.js');
config.load_config();

const Client = new Discord.Client();

Client.on('message', (msg) => {
	if (msg.content == 'hi') {
		msg.reply('Hello my dear friend...');
	}
});

console.log("He's ready");

Client.login(config.get('discord/token'));
