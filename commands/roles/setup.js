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
        category: "roles",
        permission: "founder",
    },
    execute: async (msg, { user }) => {
        const ticketEmbed = new Discord.MessageEmbed()
            .setTitle("Welcome to Helios!")
            .setDescription(
                `Select the servers you play to gain access to the entirety of the discord\nand to receive pings for any important information related to your \nselected servers.\n\nMake sure to also read the [rules](https://help.heliosmc.co.uk/rules) before you select the servers you play.`
            )
            .setColor("#3498db")
            .setFooter(
                "We hope you will enjoy your experience at Helios!",
                user.avatarURL()
            );

        const apolloButton = new MessageButton()
            .setStyle("blurple")
            .setLabel("Apollo")
            .setID("server_apollo");
        const artemisButton = new MessageButton()
            .setStyle("blurple")
            .setLabel("Artemis")
            .setID("server_artemis");
        const orpheusButton = new MessageButton()
            .setStyle("blurple")
            .setLabel("Orpheus")
            .setID("server_orpheus");
        const row = new MessageActionRow().addComponents(
            apolloButton,
            artemisButton,
            orpheusButton
        );

        await msg.channel.send(ticketEmbed, row);
    },
};
