/*jshint esversion: 11 */

const fs = require('node:fs');
const {
	REST,
	Routes
} = require('discord.js');
const {
	CLIENT_ID,
	TOKEN
} = require('../config.json');

const commands = [];

// Read command files from the 'commands' directory
const files = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of files) {
	const command = require(`../commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({
	version: '10'
}).setToken(TOKEN);

// function to deploy commands
const deployCommands = async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);
		const data = await rest.put(
			Routes.applicationCommands(CLIENT_ID), {
				body: commands
			},
		);
		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
};

module.exports = deployCommands;