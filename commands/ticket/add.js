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
        name: "add",
        category: "ticket",
        permission: "staff",
    },
    execute: async (msg, { config, mongoose }) => {
        // Check if this is a ticket channel.
        if (!msg.channel.name.includes("ticket-"))
            return msg.reply(
                "You need to be in a ticket channel :man_facepalming:"
            );

        // Get the user from the mentions.
        if (msg.mentions.members.size == 0)
            return msg.reply("You need to mention an user :man_facepalming:");
        let member = msg.mentions.members.first();

        // Set the permissions for the channel.
        msg.channel.updateOverwrite(member, {
            VIEW_CHANNEL: true,
        });

        // Create a embed for the response.
        const addEmbed = new Discord.MessageEmbed()
            .setDescription(`<@${member.id}> has been added to the ticket!`)
            .setColor("#3498db");

        // Send the embed.
        msg.channel.send(addEmbed);
    },
};
