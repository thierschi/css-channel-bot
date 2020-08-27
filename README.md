# Channel-Bot for the computersciencesquad Discord server

The css-channel-bot was originally intended to create channels on a discord server to which one person has administrating permissions. It should've been like private channels on TeamSpeak. Until now this goal has not been reached.

The bot is now heading towards being an allround bot, including music-bot and much more.

# Features

## TODOS

- [x] Ping Command - Simple ping command that returns elapsed time.
- [x] Message Cleanup - Bot saves messages top delete them later. This helps decluttering the server.
- [ ] Integration with MongoDB
  - [ ] Save Cleanup Queue to clean messages even after crash or reboot
  - [ ] User ranking system
  - [ ] Config saved in database (Long term goal: easier config, maybe UI frot end)
- [ ] Logger
- [ ] Music Bot

# Usage / Installation

Clone repository

```
git clone https://github.com/thierschi/css-channel-bot.git
```

Install node modules

```
npm install
```

Rename `config-template.toml` to `config.toml` and fill in your api-tokens.

Start the bot

```
node .
```

Ideally you run the following command.

```
nohup node . >> log.txt &
```

This prevents treminating the bot and writes all output to log.txt. (On Linux)

# Documentation

For documentation see code comments and [`doc`](./doc).
