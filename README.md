# ImageBot

ImageBot is a Discord bot that allows you to download and save the last upscaled images posted in a channel by the Midjourney bot. You can specify the number of images to download and the number of messages to read.

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

Invite the bot to your Discord server and grant it the necessary permissions.

## Configuration

The configuration file `config.json` should contain the following fields:

```json
{
  "token": "Bot Token from Discord",
  "clientId": "Your application ID",
  "dMessage": 100,
  "dImage": 40,
  "downloadLocation": "downloads",
  "midjourneyOnly": true,
  "midjourneyID": "936929561302675456"
}
```

- `token`: Your Discord bot token.
- `clientId`: Your application ID.
- `dMessage`: (Optional) Default number of messages to read. Default: 100.
- `dImage`: (Optional) Default number of images to download. Default: 40.
- `downloadLocation`: (Optional)
- `downloadLocation`: (Optional) The folder where downloaded images will be saved. Default: "downloads".
- `midjourneyOnly`: (Optional) If set to `true`, the bot will only download images posted by the Midjourney bot. Default: true.
- `midjourneyID`: (Optional) The user ID of the Midjourney bot. Replace the placeholder with the actual user ID.

Make sure to replace the placeholders with your actual Discord bot token, application ID, and the Midjourney bot user ID if needed. Adjust the default values for `dMessage`, `dImage`, and `downloadLocation` if necessary.
``

## Commands

The bot currently supports the following command:

### extract

Downloads the last upscaled images in the channel this command is invoked from.

```
/extract [images] [messages]
```

- `images`: (Optional) The number of images to download. Default: 40.
- `messages`: (Optional) The number of messages to read. Default: 100. Must be between 1 and 100.

Example:

```
/extract images=10 messages=50
```

This command downloads the last 10 upscaled images from the last 50 messages in the channel.
