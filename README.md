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

**1.** Clone repository

```
git clone https://github.com/thierschi/css-channel-bot.git
```

**2.** Rename `config-template.toml` to `config.toml` and fill in your api-tokens.

**3.** Start the bot

```
docker-compose up -d
```

Remove the `-d` flag to not run the bot in detached mode. Remember: The bot will terminate with the terminal window.

> Just run `node .` if you don't have docker installed.

# Documentation

For documentation see code comments and [`doc`](./doc).
