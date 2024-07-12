# Bopl Bot

A Discord bot for Bopl Battle.

## Features

- **Random Combination**: Sends a random combination of Bopl Battle abilities.
- **Abilities List**: Displays every ability in Bopl Battle.
- **Help Command**: Provides a list of available commands.
- **Ping Command**: Shows the bot's response time and uptime.
- **Music**: Plays Bopl Battle music in your current voice channel.
- **Disconnect**: Disconnects Bopl Bot from your voice channel.
- **Steam Reviews**: Fetches the Steam reviews for Bopl Battle.
- **Bopl Profile**: Creates a custom Bopl-themed profile picture.
- **Echo**: Sends a message as Bopl Bot in different channels.
- **Bot Info**: Provides general information about the bot.
- **Friend Code**: Retrieves a user's Steam friend code.

## Setup and Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ReallyBadDeveloper/BoplBot.git
   cd BoplBot
   ```

2. Run the setup script to install dependencies, create necessary files, and directories:
   ```bash
   npm run setup
   ```

3. Update the .env file with your bot tokens and client IDs:
   ```plaintext
   TOKEN=your-production-bot-token
   CLIENT_ID=your-production-client-id
   DEVTOKEN=your-development-bot-token
   DEVCLIENT_ID=your-development-client-id
   ```

4. Start the bot:
   ```bash
   npm run dev
   ```

## Contributing

Feel free to contribute to the project by submitting issues or pull requests. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the GNU v3 License. See the LICENSE file for details.
