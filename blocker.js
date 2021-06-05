/*global require, console, module*/
'use strict';
var fs = require('fs'),
    path = require('path'),
    sudo = require('sudo-prompt'),
    options = {
        name: 'Electron',
        icns: '/Applications/Electron.app/Contents/Resources/Electron.icns'
    },
    blockerPath = path.resolve("./blocker.js"),
    argv = process.argv.slice(2);

var blockDomains = function (domainsList) {
    domainsList = domainsList || ['www.youtube.com'];
    try {
        domainsList = domainsList.map(function (domain) {
            return '"127.0.0.1\t' + domain + '"';
        });
        sudo.exec('echo ' + domainsList[0] + ' >> /etc/hosts', options,
            function(error, stdout, stderr) {
                if (error) throw error;
                console.log('stdout: ' + stdout);
            }
        );
    } catch (err) {
        console.error(err);
    }
};

var unblockDomains = function (domainsList) {
    domainsList = domainsList || ['www.youtube.com'];
    try {
        var data = fs.readFileSync('/etc/hosts', 'utf8');
        domainsList.map(function (domain) {
            sudo.exec('sed -i "/' + domain + '/g" /etc/hosts' , options,
                function(error, stdout, stderr) {
                    if (error) throw error;
                    console.log('stdout: ' + stdout);
                }
            );
        });
    } catch (err) {
        console.error(err);
    }
};

var cmd = function (flag) {
    sudo.exec('node ' + blockerPath +' -' + flag  , options,
        function(error, stdout, stderr) {
            if (error) throw error;
            console.log('stdout: ' + stdout);
        }
    );
}

if (argv.includes('-block')) {
    blockDomains();
} else if (argv.includes('-unblock')) {
    unblockDomains();
}

module.exports = {
    cmd: cmd,
    blockDomains: blockDomains,
    unblockDomains: unblockDomains
}