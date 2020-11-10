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
const { Client } = require("discord.js");

/**
 * The main class for interacting with the Discord API.
 * @extends {Client}
 */
class Helios extends Client {
    /**
     * @param {*} options Optional arguments for the client.
     */
    constructor(options) {
        super(options);

        this.helpers = require("../helpers/helpers");
        this.config = require("../config.json");
    }

    /**
     * Authenticates with the discord gateway using the original function from the extended class but supplies the token from config.
     * @returns {Promise<string>} Token of the account.
     */
    login = () => {
        return super.login(this.config.token);
    };
}

module.exports = Helios;
