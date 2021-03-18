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
const mongoose = require("mongoose");
const ticketChannelSchema = require("./schemas/ticketChannelSchema");
const ticketGuildSchema = require("./schemas/ticketGuildSchema");

/**
 * The main class for interacting with the MongoDB.
 */
class Mongoose {
    /**
     * Opens the connection to the mongodb.
     * @param {*} helios The helios class which contains all of the major classes/etc.
     */
    constructor(helios) {
        this.helios = helios;
        this.connect();
    }

    connect = async () => {
        let path = this.helios.config.mongoConnection;
        if (!path)
            return this.helios.logger(
                "no path for mongodb has been provided",
                "error"
            );

        this.db = mongoose.connection;
        this.db.once("open", () =>
            this.helios.logger("connection to database established.", "success")
        );

        await mongoose.connect(path, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        });
    };

    getTicketGuild = async (guildId) => {
        try {
            return await ticketGuildSchema.findOne({
                _id: guildId,
            });
        } catch (e) {
            this.helios.logger("failed to fetch ticket guild data", "error");
        }
    };

    getTicketChannel = async (channelId) => {
        try {
            return await ticketChannelSchema.findOne({
                _id: channelId,
            });
        } catch (e) {
            this.helios.logger("failed to fetch ticket channel", "error");
        }
    };

    updateTicketGuildMessage = async (guildId, newMessage) => {
        try {
            await ticketGuildSchema.findOneAndUpdate(
                {
                    _id: guildId,
                },
                {
                    _id: guildId,
                    messageId: newMessage,
                },
                {
                    upsert: true,
                    setDefaultsOnInsert: true,
                }
            );
        } catch (e) {
            this.helios.logger(
                "failed to update ticket guild message.",
                "error"
            );
        }
    };

    updateTicketGuildIndex = async (guildId, newIndex) => {
        try {
            await ticketGuildSchema.findOneAndUpdate(
                {
                    _id: guildId,
                },
                {
                    ticketIndex: newIndex,
                }
            );
        } catch (e) {
            this.helios.logger("failed to update ticket guild index.", "error");
        }
    };

    saveTicketChannel = async (channelId, userId, userTag) => {
        try {
            await new ticketChannelSchema({
                _id: channelId,
                userId: userId,
                tag: userTag,
            }).save();
        } catch (e) {
            this.helios.logger("failed to save ticket channel.", "error");
        }
    };

    updateTicketChannel = async (channelId, transcript, closedBy) => {
        try {
            return await ticketChannelSchema.findOneAndUpdate(
                {
                    _id: channelId,
                },
                {
                    transcript,
                    closedBy,
                }
            );
        } catch (e) {
            this.helios.logger("failed to update ticket channel.", "error");
        }
    };

    fetchTicketChannels = async () => {
        try {
            return await ticketChannelSchema.find();
        } catch (e) {
            this.helios.logger("failed to fetch ticket channels.", "error");
        }
    };
}

module.exports = Mongoose;
