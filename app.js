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
const Helios = new (require("./core/Helios"))({
    partials: ["MESSAGE", "CHANNEL", "REACTION"],
});
require("discord-buttons")(Helios);

// Register all of the events/commands.
(() => {
    // Initialize the database.
    Helios.mongoose = new Helios.mongoose(Helios);

    // Initialize the command manager.
    Helios.commands = new Helios.commands(Helios);

    // Loop through each of the event modules.
    Helios.helpers.readDirectory("./events/", "js", (event) => {
        // Parse the event name and require the event.
        let eventName = event.split(".")[0];
        let eventModule = require(`./events/${event}`);

        // Register the event.
        Helios.on(eventName, (...args) => eventModule(Helios, ...args));
        Helios.logger(`${eventName} has been registered.`, "success");
    });
})();

// Authenticate with the discord gateway.
Helios.login();
