const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits, EmbedBuilder, ActivityType } = require('discord.js');
const { createAudioPlayer, joinVoiceChannel, createAudioResource } = require('@discordjs/voice');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const dotenv = require('dotenv');
const { exec } = require('child_process');
const { abilities } = require('./abilities');

dotenv.config();

const dev = require('./config.json').dev;
const version = '1.3.0';
const TOKEN = dev ? process.env.DEVTOKEN : process.env.TOKEN;
const CLIENT_ID = dev ? process.env.DEVCLIENT_ID : process.env.CLIENT_ID;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();

// Command loading
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.data.name, command);
}

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  const chalk = (await import('chalk')).default;

  try {
    console.log(chalk.blue('Started refreshing application (/) commands.'));
    
    const commands = client.commands.map(command => command.data.toJSON());
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
    
    console.log(chalk.blue('Successfully reloaded application (/) commands.'));
  } catch (error) {
    console.error(chalk.red('Error reloading application (/) commands:', error));
  }
})();

client.once('ready', async () => {
  const chalk = (await import('chalk')).default;

  console.log(chalk.green(`Logged in as ${client.user.tag}!`));
  setInterval(() => {
    client.user.setActivity(client.guilds.cache.size + ' servers', { type: ActivityType.Watching });
  }, 300000);
  if (!dev) {
    client.channels.fetch('1236702177515409469').then(channel => 
      channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(0x54ff47)
            .setTitle('Bot is online! :wireless:')
            .setDescription("Currently being hosted on Really Bad Dev's computer!"),
        ],
      })
    ).catch(error => console.error(chalk.red('Error sending online message:', error)));
  }
});

client.on('interactionCreate', async interaction => {
  const chalk = (await import('chalk')).default;

  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
    console.log(chalk.blue(`Executed command: ${interaction.commandName}`));
  } catch (error) {
    console.error(chalk.red(`Error executing command: ${interaction.commandName}`, error));
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});

client.on('messageCreate', async (message) => {
  const chalk = (await import('chalk')).default;

  try {
    if (
      message.content.toLowerCase().includes('kill yourself') ||
      message.content.toLowerCase().includes('kys') ||
      message.content.toLowerCase().includes('kill myself') ||
      message.content.toLowerCase().includes('kms')
    ) {
      message.reply(
        'https://media1.tenor.com/m/c5a_h8U1MzkAAAAC/nuh-uh-beocord.gif'
      );
      console.log(chalk.yellow('Detected and responded to harmful message.'));
    }
    if (
      message.content.toLowerCase().includes(' op') ||
      message.content.toLowerCase().includes(' overpowered') ||
      message.content.toLowerCase().includes('nerf') ||
      message.content.toLowerCase().includes('buff ')
    ) {
      var bblox = client.emojis.cache.get('1253098761618460742');
      message.reply(`skill issue ${bblox}`);
      console.log(chalk.yellow('Responded to a nerf, buff, op, etc'));
    }
    if (message.content.toLowerCase().includes('<@164689064434466816>')) {
      message.delete();
      message.channel.send({
        ephemeral: true,
        content: `<@${message.author.id}>`,
        embeds: [
          new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle(`Don't ping Zapray!`)
            .setDescription(
              `Zapray is busy right now, please ping a moderator for assistance/questions.`
            ),
        ],
      });
      console.log(chalk.yellow('Deleted message and responded to mention of Zapray.'));
    }
  } catch (error) {
    console.error(chalk.red('Error handling message:', error));
  }
});

client.login(TOKEN).catch(async error => {
  const chalk = (await import('chalk')).default;

  console.error(chalk.red('Error logging in:', error));
});
