/*
    MIT License

    Copyright (c) 2020 Aigars A

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
*/
const Discord = require("discord.js");
const fs = require("fs");
const ticketChannelSchema = require("../../db/schemas/ticketChannelSchema");

module.exports = {
    info: {
        name: "leaderboard",
        category: "ticket",
        permission: "staff",
    },
    execute: async (msg, Helios) => {
        let leaderboard = {};

        // Grab the data from the mongodb.
        await Helios.mongoose.get().then(async (mongoose) => {
            try {
                const result = await ticketChannelSchema.find();
                if (!result) return;

                result.map((ticket) => {
                    leaderboard[ticket.closedBy] = leaderboard[ticket.closedBy]
                        ? leaderboard[ticket.closedBy] + 1
                        : 1;
                });
            } finally {
                mongoose.connection.close();
            }
        });

        // Create a leaderboard array.
        let data = Object.keys(leaderboard).map((key) => {
            return [key, leaderboard[key]];
        });

        // Sort the leaderboard array.
        data.sort((first, second) => {
            return second[1] - first[1];
        });

        // Get the top five.
        leaderboard = data;

        let emoji = msg.guild.emojis.cache.find(
            (emoji) => emoji.id === Helios.config.tickets.emoji
        );

        // Setup a string of data.
        let output = "";
        leaderboard.map((entry, index) => {
            output += `\`${index + 1}.\` <:${emoji.name}:${emoji.id}> \`${
                entry[1]
            } Tickets\`  <@${entry[0]}>\n`;
        });

        // Output the data with a embed.
        const leaderboardEmbed = new Discord.MessageEmbed()
            .setAuthor(
                `Helios Ticket Leaderboard`,
                "https://cdn.discordapp.com/avatars/771824383429050379/4c48fcc72ea0640c9a1b8709770f41bc.png"
            )
            .setDescription(output)
            .setColor("#3498db");
        msg.channel.send(leaderboardEmbed);
    },
};
