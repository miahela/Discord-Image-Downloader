/*jshint esversion: 11 */

const fs = require('node:fs');
const path = require('node:path');
const {
	Client,
	Events,
	GatewayIntentBits,
	Collection
} = require('discord.js');
const config = require('./config.json');
const deployCommands = require('./helpers/deployCommands');

const client = new Client({
	intents: [GatewayIntentBits.Guilds]
});
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${file} is missing a required "data" or "execute" property.`);
	}
}

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
	deployCommands();
});

client.login(config.token);

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({
			content: 'There was an error while executing this command!',
			ephemeral: true
		});
	}
});