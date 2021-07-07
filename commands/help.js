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
        name: "help",
    },
    execute: async (msg, { commands, user }, args) => {
        // Get all of the commands.
        commands = commands.get();

        // Create the embed.
        const commandEmbed = new Discord.MessageEmbed()
            .setDescription(``)
            .setFooter(
                `To be able to use a categorized command specify the category before the command.`,
                user.defaultAvatarURL
            )
            .setColor("#3498db");

        // Separate the commands into a dictionary.
        let categories = [];
        commands.map((command) => {
            let category = command.info.category;
            if (categories.includes(category)) return;
            categories.push(category);
        });

        // Add a field for each categorized command.
        categories.map((category) => {
            if (category) {
                commandEmbed.addField(
                    `${
                        category.charAt(0).toUpperCase() + category.slice(1)
                    } Commands`,
                    commands
                        .map((command) => {
                            if (command.info.category !== category) return;
                            return `\`${command.info.name}\``;
                        })
                        .join(" ")
                );
            } else {
                commandEmbed.setDescription(
                    "Here is a list of all the commands :eyes:\n" +
                        commands
                            .map((command) => {
                                if (command.info.category !== category) return;
                                return `\`${command.info.name}\``;
                            })
                            .join(" ")
                );
            }
        });

        // Send the embed.
        msg.channel.send(commandEmbed);
    },
};
