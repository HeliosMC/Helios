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

module.exports = {
    info: {
        name: "delete",
        category: "ticket",
        permission: "staff",
        alias: ["close"],
    },
    execute: async (msg, { logger, config, mongoose }, args) => {
        // Check if this is a ticket channel.
        if (!msg.channel.name.includes("ticket-"))
            return msg.reply(
                "You need to be in a ticket channel :man_facepalming:"
            );

        // Fetch all of the messages and save them in a file.
        const path = `${config.tickets.path}/${msg.guild.id}/`;
        msg.channel.messages.fetch().then((messages) => {
            let transcript = [];

            messages.map((msg) => {
                transcript.push(
                    `[${msg.createdAt}] ${msg.author.tag}: ${
                        msg.content
                    } ${msg.attachments
                        .map((attachment) => attachment.proxyURL)
                        .join(" ")}`
                );
            });

            fs.mkdir(path, { recursive: true }, () => {
                fs.writeFile(
                    `${path}${msg.channel.id}.txt`,
                    transcript.reverse().join("\n"),
                    () => {}
                );
            });
        });

        // Save the channel data to the database.
        let username = (
            await mongoose.updateTicketChannel(
                msg.channel.id,
                `${config.tickets.web}${msg.guild.id}/${msg.channel.id}.txt`,
                msg.author.id
            )
        ).tag;

        // Log the transcript to the channel.
        const ticketEmbed = new Discord.MessageEmbed()
            .addField("Username", username, true)
            .setColor("#3498db")
            .setTimestamp()
            .setFooter(
                msg.channel.name,
                "https://cdn.discordapp.com/avatars/771824383429050379/4c48fcc72ea0640c9a1b8709770f41bc.png"
            );

        // Send a message to the ticket owner.
        if (args.length >= 2) {
            const ticketChannel = await mongoose.getTicketChannel(
                msg.channel.id
            );

            const reason = args.splice(1).join(" ");
            ticketEmbed.addField("Reason", reason, true);

            const closedEmbed = new Discord.MessageEmbed()
                .addFields(
                    {
                        name: "Reason",
                        value: reason,
                        inline: true,
                    },
                    { name: "Closed By", value: msg.author.tag, inline: true },
                    {
                        name: "Transcript",
                        value: `[Click here](${config.tickets.web}${msg.guild.id}/${msg.channel.id}.txt)`,
                        inline: true,
                    }
                )
                .setColor("#3498db")
                .setTimestamp()
                .setFooter(
                    msg.channel.name,
                    "https://cdn.discordapp.com/avatars/771824383429050379/4c48fcc72ea0640c9a1b8709770f41bc.png"
                );
            msg.guild.members.cache.get(ticketChannel.userId).send(closedEmbed);
        }

        // Log to transcript channel.
        ticketEmbed.addFields(
            { name: "Closed By", value: msg.author.tag, inline: true },
            {
                name: "Transcript",
                value: `[Click here](${config.tickets.web}${msg.guild.id}/${msg.channel.id}.txt)`,
                inline: true,
            }
        );
        await msg.guild.channels.cache
            .find((channel) => channel.id === config.tickets.log)
            .send(ticketEmbed);

        // Delete the channel.
        msg.channel.delete();
    },
};
