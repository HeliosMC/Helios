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

module.exports = async (Helios, button) => {
    let mongoose = Helios.mongoose;
    let msg = button.message;

    await button.clicker.fetch();
    let user = button.clicker.user;

    if (
        button.id === "ticket_apollo" ||
        button.id === "ticket_artemis" ||
        button.id === "ticket_orpheus" ||
        button.id === "ticket_other"
    ) {
        await button.reply.defer();

        // Check if this is a valid setup message.
        const guildData = await mongoose.getTicketGuild(msg.guild.id);
        if (!guildData || guildData.messageId !== msg.id) return;
        let ticketIndex = guildData.ticketIndex;

        // Check for an existing ticket.
        let foundTicket =
            msg.guild.channels.cache.filter(
                (channel) =>
                    channel.name.includes("ticket-") &&
                    channel.permissionOverwrites.find(
                        (permission) => permission.id === user.id
                    )
            ).size > 0;
        if (foundTicket) return;

        // Update the index.
        ticketIndex++;
        await mongoose.updateTicketGuildIndex(msg.guild.id, ticketIndex);

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
            `ticket-${ticketIndex.toString().padStart(4, 0)}-${
                button.id.split("_")[1]
            }`,
            {
                permissionOverwrites,
                parent: msg.guild.channels.cache.get(
                    Helios.config.tickets.parent
                ),
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
                Helios.user.avatarURL()
            );
        channel.send(`<@${user.id}>`, ticketEmbed);
    }
};
