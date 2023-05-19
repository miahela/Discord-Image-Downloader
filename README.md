# Discord-Image-Downloader

Discord-Image-Downloader is a Discord bot that allows you to download and save the last upscaled images posted in a channel by the Midjourney bot. You can specify the number of images to download and the number of messages to read.

## Features

- Download the last upscaled images from a channel
- Set the number of images to download
- Set the number of messages to read

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Commands](#commands)

## Prerequisites

- Node.js v16.6.0 or higher
- NPM v7 or higher
- Discord.js v14.9.0 or higher
- Image Downloader v4.3.0 or higher

## Installation

1. Clone this repository:
   ```
   git clone https://github.com/miahela/DiscordBot-DownloadUpscaledMidjourneyPhotos.git
   ```
2. Install the required dependencies:
   ```
   npm install
   ```
3. Rename `configExample.json` to `config.json` and update the contents with your Discord bot token and other settings.

4. Start the bot:
   ```
   node index.js
   ```

## Usage

To use the Discord-Image-Downloader, invite the bot to your Discord server and grant it the necessary permissions.

By default, the bot is configured to only download upscaled images posted by the Midjourney bot. If you want to download any images (not just Midjourney's images), you can make the required changes to the config.json file.

## Configuration

The configuration file `config.json` should contain the following fields:

```json
{
    "TOKEN": "Bot Token from Discord",
    "CLIENT_ID": "Your application ID",
    "DOWNLOAD_LOCATION": "Your download location",
    "DEFAULT_READ_MESSAGES_LIMIT": 100,
    "DEFAULT_IMAGES_LIMIT": 40,
    "MIDJOURNEY_ID": "936929561302675456",
    "MIDJOURNEY_ONLY": true,
    "UPSCALED_ONLY": true
}
```

- `TOKEN`: (REQUIRED) Your Discord bot token.
- `CLIENT_ID`: (REQUIRED) Your application ID.
- `DOWNLOAD_LOCATION`: (REQUIRED) Full path of the folder where downloaded images should be saved. Ex. `C:\\Users\\User\\Downloads\\` for Windows or `/Users/user/Downloads/` for Linux/Mac
- `DEFAULT_READ_MESSAGES_LIMIT`: (Optional) Default number of messages to read. Default: 100.
- `DEFAULT_IMAGES_LIMIT`: (Optional) Default number of images to download. Default: 40.
- `MIDJOURNEY_ID`: (Optional) The user ID of the Midjourney bot. If you want to download only messages of some specific user (not Midjourney) replace the default id with the user ID of your targeted user.
- `MIDJOURNEY_ONLY`: (Optional) If set to `true`, the bot will only download images posted by the Midjourney bot. Default: true.
- `UPSCALED_ONLY`: (Optional) If set to `true`, the bot will only download upscaled images by Midjourney. Default: true.

Make sure to replace the placeholders with your actual Discord bot token, application ID, download location. Adjust the default values for `dMessage`, `dImage`, and `downloadLocation` if necessary.

``

## Commands

The bot currently supports the following command:

### extract

Downloads the last upscaled images in the channel this command is invoked from.

```
/extract [images] [messages]
```

- `images`: (Optional) The number of images to download. Default: 40.
- `messages`: (Optional) The number of messages to read. Default: 100.

Example:

```
/extract images=10 messages=50
```

This command downloads the last 10 upscaled images from the last 50 messages in the channel.
