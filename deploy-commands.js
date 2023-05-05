/*jshint esversion: 11 */

// Import necessary modules and values from config
const {
	REST,
	Routes
} = require('discord.js');
const {
	clientId,
	guildId,
	token
} = require('./config.json');
const fs = require('node:fs');

// Initialize commands array and read command files
const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Load command data for deployment
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
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
		// Catch and log errors
		console.error(error);
	}
})();