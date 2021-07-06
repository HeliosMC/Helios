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
const ticketGuildSchema = require("../db/schemas/ticketGuildSchema");
const ticketChannelSchema = require("../db/schemas/ticketChannelSchema");

// https://stackoverflow.com/questions/10073699/pad-a-number-with-leading-zeros-in-javascript
function pad(n, width, z) {
    z = z || "0";
    n = n + "";
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

module.exports = async (Helios, reaction, user) => {
    let mongoose = Helios.mongoose;
    let msg = reaction.message;
    let emoji = reaction.emoji;

    // Some basic checks to make sure they are not a bot and it is the right emoji.
    if (user.bot) return;
    if (emoji.id !== Helios.config.tickets.emoji) return;

    // Check if it is a actual ticket message.
    const guildData = await mongoose.getTicketGuild(msg.guild.id);
    if (!guildData || guildData.messageId !== msg.id) return;
    let ticketIndex = guildData.ticketIndex;

    // Probably the worst way ever but o well.
    let foundTicket = false;
    msg.guild.channels.cache.map((channel) => {
        if (!channel.name.includes("ticket-")) return;
        let permission = channel.permissionOverwrites.find(
            (permission) => permission.id === user.id
        );
        if (!permission) return;
        foundTicket = true;
    });
    if (foundTicket) return;

    // Update the index.
    await mongoose.updateTicketGuildIndex(msg.guild.id, ticketIndex + 1);

    // Open a ticket as it does not exist.
    let permissionOverwrites = [
        {
            id: msg.guild.roles.everyone.id,
            deny: ["VIEW_CHANNEL"],
        },
        {
            id: user.id,
            allow: ["VIEW_CHANNEL"],
        },
    ];

    Helios.config.permissions.staff.map((id) =>
        permissionOverwrites.push({
            id,
            allow: ["VIEW_CHANNEL"],
        })
    );

    let channel = await msg.guild.channels.create(
        `ticket-${pad(ticketIndex + 1, 4)}`,
        {
            permissionOverwrites,
            parent: msg.guild.channels.get(Helios.config.tickets.parent),
        }
    );

    // Save the ticket to the channels database.
    await mongoose.saveTicketChannel(channel.id, user.id, user.tag);

    // Send a introduction message to the channel.
    const ticketEmbed = new Discord.MessageEmbed()
        .setDescription(`Support will be with you shortly.`)
        .setColor("#3498db")
        .setFooter(
            "Please describe your issue while you wait!",
            "https://cdn.discordapp.com/avatars/771824383429050379/4c48fcc72ea0640c9a1b8709770f41bc.png"
        );
    channel.send(`<@${user.id}>`, ticketEmbed);

    // Remove the reaction.
    await reaction.users.remove(user.id);
};
