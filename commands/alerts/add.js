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
        name: "add",
        category: "alerts",
        permission: "founder",
    },
    execute: async (msg, { mongoose }, args) => {
        // Check the the size of args.
        if(args.length <= 1)
            return msg.reply(
                "You need to specify a name for the alert :man_facepalming:"
            );
        else if(args.length <= 2)
            return msg.reply(
                "You need to specify a description for the alert :man_facepalming:"
            );
        
        // Parse the arguments.
        let name = args[1];
        let description = args.slice(2).join(" ");

        // TODO: Add to the mongoose database.

        // Reply that the alert has been registered.
        msg.reply("The alert has been registered :clap:");
    },
};
