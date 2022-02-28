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
const { MessageButton, MessageActionRow } = require("discord-buttons");

module.exports = {
    info: {
        name: "setup",
        category: "ticket",
        permission: "founder",
    },
    execute: async (msg, { mongoose, user }) => {
        const ticketEmbed = new Discord.MessageEmbed()
            .setTitle("Server Support")
            .setDescription(`Choose the server to create a ticket for support.`)
            .setColor("#3498db")
            .setFooter(
                "Your ticket will be located at the top of discord.",
                user.avatarURL()
            );

        const survivalButton = new MessageButton()
            .setStyle("blurple")
            .setLabel("Survival")
            .setID("ticket_survival");
        const otherButton = new MessageButton()
            .setStyle("gray")
            .setLabel("Other")
            .setID("ticket_other");
        const row = new MessageActionRow().addComponents(
            survivalButton,
            otherButton
        );

        let ticketMessage = await msg.channel.send(ticketEmbed, row);
        await mongoose.updateTicketGuildMessage(msg.guild.id, ticketMessage.id);
    },
};
