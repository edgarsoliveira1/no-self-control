/*global require, module*/
'use strict';

var path = require('path'),
    unblockPath = path.resolve("./icons/unblocked.png"),
    blockPath = path.resolve("./icons/blocked.png"),
    child_process = require("child_process"),
    exex = child_process.exec;

var notify_unblock = function () {
    exex('notify-send "Time for a Break!" "Youtube is unblocked" -i ' + unblockPath);
};

var notify_block = function () {
    exex('notify-send "Time for Work Hard!" "Youtube is blocked" -i ' + blockPath);
};

module.exports = {
    notify_block: notify_block,
    notify_unblock: notify_unblock
};
