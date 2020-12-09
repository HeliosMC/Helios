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

module.exports = {
    info: {
        name: "setup",
        category: "ticket",
        permission: "founder",
    },
    execute: async (msg, { config, mongoose }) => {
        // TODO: Proper emoji configuration which saves in the database - i was too lazy.
        let guildId = msg.guild.id;
        let emoji = msg.guild.emojis.cache.find(
            (emoji) => emoji.id === config.tickets.emoji
        );

        const ticketEmbed = new Discord.MessageEmbed()
            .setTitle("Server Support")
            .setDescription(
                `React with the <:${emoji.name}:${emoji.id}> to create a ticket!`
            )
            .setColor("#3498db")
            .setFooter(
                "Your ticket will be located at the top of discord.",
                "https://cdn.discordapp.com/avatars/771824383429050379/4c48fcc72ea0640c9a1b8709770f41bc.png"
            );
        let ticketMessage = await msg.channel.send(ticketEmbed);
        ticketMessage.react(emoji);

        await mongoose.updateTicketGuildMessage(guildId, ticketMessage.id);
    },
};
