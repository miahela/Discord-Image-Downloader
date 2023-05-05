/*jshint esversion: 11 */

// Import required modules
const fs = require('node:fs');
const path = require('node:path');
const {
	Client,
	Events,
	GatewayIntentBits,
	Collection,
	REST,
	Routes
} = require('discord.js');
const config = require('./config.json');


// Retrieve configuration values
const {
	clientId,
	guildId,
	token
} = require('./config.json');

// Initialize commands array
const commands = [];

// Read command files from the 'commands' directory
const files = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Load each command's data for deployment
for (const file of files) {
	const command = require(`./commands/extract.js`);
	commands.push(command.data.toJSON());
}

// Set up REST module with token
const rest = new REST({
	version: '10'
}).setToken(token);

// Deploy commands
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationCommands(clientId), {
				body: commands
			},
		);


		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {

		console.error(error);
	}
})();

// Initialize client and commands collection
const client = new Client({
	intents: [GatewayIntentBits.Guilds]
});
client.commands = new Collection();

// Load command files
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Add commands to the client's command collection
for (const file of commandFiles) {
	const command = require('./commands/extract.js');

	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

// Log in and handle events
client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
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