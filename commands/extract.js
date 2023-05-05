/*jshint esversion: 11 */
// @ts-check

// Import required modules and values from config
const {
    SlashCommandBuilder,
    EmbedBuilder,
    ChatInputCommandInteraction,
    Message,
    Collection
} = require('discord.js');
const download = require('image-downloader');
const {
    dMessage,
    dImage,
    downloadLocation,
    midjourneyID,
    midjourneyOnly
} = require('../config.json');

const path = require('path');
const process = require('process');
const fs = require('fs');

// Define default values
const DEFAULT_IMAGES = dImage;
const DEFAULT_MESSAGES = dMessage;
const DOWNLOAD_LOCATION = downloadLocation;
const MIDJOURNEY_ID = midjourneyID;
const ONLYMIDJOURNEY = midjourneyOnly;
const UPSCALED_PATTERN = /Image\s+#\d+/;

// Export command data and execute function
module.exports = {
    data: new SlashCommandBuilder()
        .setName('extract')
        .setDescription('Downloads the last upscaled images in the channel this command is invoked from')
        .addIntegerOption(option => {
            return option.setName('images')
                .setDescription('Number of images to download. Default: 40')
                .setRequired(false)
                .setMinValue(1);
        })
        .addIntegerOption(option => {
            return option.setName('messages')
                .setDescription('Number of messages to read. Default: 100')
                .setRequired(false)
                .setMinValue(1)
                .setMaxValue(100);
        }),
    /**
     * @param  {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        // Create download directory if it doesn't exist
        if (!fs.existsSync(path.join(process.cwd(), `./${DOWNLOAD_LOCATION}`))) {
            fs.mkdirSync(path.join(process.cwd(), `./${DOWNLOAD_LOCATION}`));
        }

        // Retrieve number of images and messages from command options, or use defaults
        let numberOfImages = interaction.options.getInteger('images') ?? DEFAULT_IMAGES;
        let currImages = 0;
        const numberOfMessages = interaction.options.getInteger('messages') ?? DEFAULT_MESSAGES;

        // Defer reply to ensure command does not time out
        await interaction.deferReply();

        // Fetch messages in the channel and process them
        interaction.channel?.messages.fetch({
                limit: numberOfMessages,
                cache: false
            })
            .then((messages) => {

                console.log(`Received ${messages.size} messages`);

                messages.forEach(element => {
                    // Check if message author is valid and if it has any attachments
                    if (((ONLYMIDJOURNEY && element.author.id === MIDJOURNEY_ID) || !midjourneyOnly) && element.attachments.size > 0) {
                        console.log(element);

                        // Check if the message content matches the upscaled pattern
                        if (UPSCALED_PATTERN.test(element.content)) {
                            element.attachments.forEach(image => {
                                if (currImages <= numberOfImages) {
                                    let link = image.url;

                                    // Download image to specified location
                                    download.image({
                                            url: link,
                                            dest: path.join(process.cwd(), `/${DOWNLOAD_LOCATION}\\${image.name}`)
                                        })
                                        .then(({
                                            filename
                                        }) => {
                                            console.log("Saved to ", filename);
                                        }).catch(console.error);

                                    currImages++;
                                }
                            });
                        }
                    }
                });
            })
            .catch(console.error);

        // Reply to user indicating images have been saved
        await interaction.editReply(`Images have been saved`);
    },

};