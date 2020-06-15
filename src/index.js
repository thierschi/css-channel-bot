const Discord = require('discord.js');
const config = require('./util/config_loader');
const event_handler_initializer = require('./features/event_handler_initializer');
const shared = require('./util/shared_var');

config.load_config();
shared.add('Client', new Discord.Client());

event_handler_initializer.create_eventhandlers(shared.get('Client'));

shared.get('Client').login(config.get('discord/token'));
