const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits, EmbedBuilder, ActivityType } = require('discord.js');
const { createAudioPlayer, joinVoiceChannel, createAudioResource } = require('@discordjs/voice');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const dotenv = require('dotenv');
const { exec } = require('child_process');
const friendcodes = require('./friendcodes');
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
  try {
    console.log('Started refreshing application (/) commands.');
    
    const commands = client.commands.map(command => command.data.toJSON());
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
    
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
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
    );
  }
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});

client.on('messageCreate', (message) => {
	if (
		message.content.toLowerCase().includes('kill yourself') ||
		message.content.toLowerCase().includes('kys') ||
		message.content.toLowerCase().includes('kill myself') ||
		message.content.toLowerCase().includes('kms')
	) {
		message.reply(
			'https://media1.tenor.com/m/c5a_h8U1MzkAAAAC/nuh-uh-beocord.gif'
		)
	}
	if (
		message.content.toLowerCase().includes(' op') ||
		message.content.toLowerCase().includes(' overpowered') ||
		message.content.toLowerCase().includes('nerf') ||
		message.content.toLowerCase().includes('buff ')
	) {
		var bblox = client.emojis.cache.get('1253098761618460742')
		message.reply(`skill issue ${bblox}`)
	}
	if (message.content.toLowerCase().includes('<@164689064434466816>')) {
		message.delete()
		message.channel.send({
			ephemeral: true,
			content: `<@${message.author.id}>`,
			embeds: [
				new EmbedBuilder()
					.setColor(embedColors.red)
					.setTitle(`Don't ping Zapray!`)
					.setDescription(
						`Zapray is busy right now, please ping a moderator for assistance/questions.`
					),
			],
		})
	}
})

client.login(TOKEN);
