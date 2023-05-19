/*jshint esversion: 11 */
// @ts-check

const {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
} = require('discord.js');
const download = require('image-downloader');
const path = require('path');
const {
    DEFAULT_READ_MESSAGES_LIMIT,
    DEFAULT_IMAGES_LIMIT,
    DOWNLOAD_LOCATION,
    MIDJOURNEY_ID,
    MIDJOURNEY_ONLY,
    UPSCALED_ONLY,
} = require('../config.json');
const fetchMessages = require('../helpers/fetchMessages');

const UPSCALED_PATTERN = /Image\s+#\d+/; //This is the pattern thath Midjourney uses for upscaled images

// Export command data and execute function
module.exports = {
    data: new SlashCommandBuilder()
        .setName('extract')
        .setDescription('Downloads the last upscaled images in the channel this command is invoked from')
        .addIntegerOption(option => {
            return option.setName('images')
                .setDescription(`Maximum number of images to download. Default: ${DEFAULT_IMAGES_LIMIT}`)
                .setRequired(false)
                .setMinValue(1)
        })
        .addIntegerOption(option => {
            return option.setName('messages')
                .setDescription(`Number of messages to read. Default: ${DEFAULT_READ_MESSAGES_LIMIT}`)
                .setRequired(false)
                .setMinValue(1)
        }),
    /**
     * @param  {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        try {
            // Retrieve number of images and messages from passed as commands to the bot, or use defaults
            const numberOfImages = interaction.options.getInteger('images') ?? DEFAULT_IMAGES_LIMIT;
            const numberOfMessages = interaction.options.getInteger('messages') ?? DEFAULT_READ_MESSAGES_LIMIT;
            let savedImages = 0;

            await interaction.deferReply();
            let messages = await fetchMessages(interaction.channel, numberOfMessages);

            console.log(`Received ${messages.size} messages`);

            let downloadPromises = []; // an array to hold all download promises

            messages.forEach(element => {

                /* isCorrectAuthor first checks if you want to only download midjourney images, and then checks if the author is midjourney
                If you don't want to limit it to Midjourney, set midjourneyOnly to false in config.json */
                let isCorrectAuthor = !MIDJOURNEY_ONLY || (MIDJOURNEY_ONLY && element.author.id === MIDJOURNEY_ID);
                let hasAttachments = element.attachments.size > 0;
                let isUpscaledImage = UPSCALED_PATTERN.test(element.content) || !UPSCALED_ONLY;

                if (isCorrectAuthor && hasAttachments && isUpscaledImage) {
                    element.attachments.forEach(image => {
                        if (savedImages < numberOfImages) {
                            let link = image.url;
                            const imageDestination = path.join(DOWNLOAD_LOCATION, image.name);

                            // push the download promise to the array
                            downloadPromises.push(
                                download.image({
                                    url: link,
                                    dest: imageDestination
                                })
                                .then(({
                                    filename
                                }) => {
                                    console.log("Saved to ", filename);
                                    savedImages++;
                                })
                                .catch(console.error)
                            );
                        }
                    });
                }
            });

            // Wait for all download promises to finish
            await Promise.all(downloadPromises);
            // Reply to user indicating images have been saved
            await interaction.editReply(`Saved ${savedImages} images to ${DOWNLOAD_LOCATION}`);

        } catch (error) {
            console.error("Error executing command", error);
        }
    },
};