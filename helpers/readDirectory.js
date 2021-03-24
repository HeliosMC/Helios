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
const fs = require("fs");

/**
 * Return all of the files in a directory with the specific extension.
 * @param {*} path The directory of the files.
 * @param {*} extension Filter the files by the extension.
 * @param {*} callback Called for each file.
 */
module.exports = (path, extension, callback) => {
    fs.readdir(path, (err, files) => {
        files.forEach((file) => {
            if (extension == null) return callback(file); // Ignore the extension check.
            if (file.split(".")[1] == extension) callback(file);
        });
    });
};
