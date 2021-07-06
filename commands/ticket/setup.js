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
    execute: async (msg, { mongoose }) => {
        const ticketEmbed = new Discord.MessageEmbed()
            .setTitle("Server Support")
            .setDescription(`Choose the server to create a ticket for support.`)
            .setColor("#3498db")
            .setFooter(
                "Your ticket will be located at the top of discord.",
                "https://cdn.discordapp.com/avatars/771824383429050379/4c48fcc72ea0640c9a1b8709770f41bc.png"
            );

        const apolloButton = new MessageButton()
            .setStyle("blurple")
            .setLabel("Apollo")
            .setID("ticket_apollo");
        const artemisButton = new MessageButton()
            .setStyle("blurple")
            .setLabel("Artemis")
            .setID("ticket_artemis");
        const orpheusButton = new MessageButton()
            .setStyle("blurple")
            .setLabel("Orpheus")
            .setID("ticket_orpheus");
        const otherButton = new MessageButton()
            .setStyle("gray")
            .setLabel("Other")
            .setID("ticket_other");
        const row = new MessageActionRow().addComponents(
            apolloButton,
            artemisButton,
            orpheusButton,
            otherButton
        );

        let ticketMessage = await msg.channel.send(ticketEmbed, row);
        await mongoose.updateTicketGuildMessage(msg.guild.id, ticketMessage.id);
    },
};
