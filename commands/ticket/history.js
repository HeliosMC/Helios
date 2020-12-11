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
        name: "history",
        category: "ticket",
        permission: "staff",
    },
    execute: async (msg, { config, mongoose }, args) => {
        // Get the user from the mentions.
        if (msg.mentions.members.size == 0)
            return msg.reply("You need to mention an user :man_facepalming:");
        let member = msg.mentions.members.first();

        // Check if they have specified a page number.
        const pageNumber = parseInt(args[2]) || 1;

        // Retrieve all of the tickets from a user.
        let tickets = await mongoose.fetchTicketChannels();
        if (!tickets) return;
        tickets = tickets.filter(
            (ticket) => ticket.userId == member.id && ticket.closedBy
        );

        // Paginate the array.
        let paginatedTickets = tickets.slice(
            (pageNumber - 1) * 5,
            pageNumber * 5
        );

        // Generate an embed for the tickets.
        const historyEmbed = new Discord.MessageEmbed()
            .setDescription(
                paginatedTickets.length > 0
                    ? `<@${member.id}> has a history of ${paginatedTickets.length} tickets :eyes:`
                    : `Looks like this page is empty :face_with_hand_over_mouth:`
            )
            .setFooter(
                `You can access other pages by specifying the page number.`,
                "https://cdn.discordapp.com/avatars/771824383429050379/4c48fcc72ea0640c9a1b8709770f41bc.png"
            )
            .setColor("#3498db");

        // Update fields.
        paginatedTickets.map((entry, index) => {
            historyEmbed.addField(
                `Ticket #${pageNumber - 1 + index + 1}`,
                `Transcript: [Click here](${entry.transcript})\nClosed By: <@${entry.closedBy}>`
            );
        });

        // Send embed.
        msg.channel.send(historyEmbed);
    },
};
