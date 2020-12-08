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
module.exports = (Helios, msg) => {
    // Check the message channel.
    if (msg.channel.type != "text") return;

    // Check the prefix of the message.
    if (!msg.content.startsWith(Helios.config.prefix)) return;

    // Make sure the message is not being sent from a bot.
    if (msg.author.bot) return;

    // Retrieve the arguments of the message and the command.
    let args = msg.content.split(" ");
    let command = args.shift().slice(Helios.config.prefix.length);

    // Retrieve the command module.
    let module = Helios.commands.get(command);
    if (!module) {
        // Check if it is a category command.
        module = Helios.commands.get(args[0], command);
        if(!module) return;
    }

    // Check permissions.
    if (module.info.permission != undefined || module.info.permission == "") {
        // Loop through the users roles.
        let foundRole =
            module.info.permission == "founder" &&
            msg.author.id == msg.guild.ownerID;

        // Get the roles required for the permission.
        let roles = Helios.config.permissions[module.info.permission];
        if (roles && !foundRole) {
            msg.member.roles.cache.map((role) => {
                if (roles.includes(role.id)) foundRole = true;
            });
        }

        // Check if found role.
        if (!foundRole)
            return msg.reply(
                "Naughty! You don't have the required role :eyes:"
            );
    }

    // Execute the function.
    module.execute(msg);
};
