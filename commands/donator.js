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

module.exports = {
    info: {
        name: "donator",
        permission: "staff",
    },
    execute: (msg) => {
        // Get the user from the mentions.
        if (msg.mentions.members.size == 0)
            return msg.reply("You need to mention an user :man_facepalming:");
        let member = msg.mentions.members.first();

        // Get the donator role.
        let role = msg.guild.roles.cache.filter(
            (role) => role.name === "Donator"
        );
        if (!role) return msg.reply("Unable to fetch the role.");

        // Give the member the role.
        member.roles
            .add(role)
            .then(msg.reply("The role has been given to the user."));
    },
};
