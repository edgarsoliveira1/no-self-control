/*global document, setInterval, clearInterval, require*/
'use strict';

var blocker = require('./blocker'),
    notification = require('./notification'),
    title = document.getElementById('title'),
    timer = document.getElementById('timer'),
    start = document.getElementById('start'),
    reset = document.getElementById('reset'),
    timeForALongBreak = 2,
    workTime = 1000 * 60 * 25,
    // workTime = 1000 * 25,
    currentTime = workTime,
    breakTime = 1000 * 60 * 5,
    longBreakTime = 1000 * 60 * 15,
    // breakTime = 1000 * 5,
    timeLeft = currentTime,
    stop = true,
    intervalID = null;


var msTodividedTime = function (ms) {
    return {
        day: Math.floor(ms / (1000 * 60 * 60 * 24)),
        hour: Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minute: Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60)),
        second: Math.floor((ms % (1000 * 60)) / 1000)
    };
};

var timeToString = function (n) {
    if (n < 10) {
        return '0' + n;
    }
    return '' + n;
};

var updateTimterDisplay = function (timeLeft) {
    var time = msTodividedTime(timeLeft);
    timer.innerHTML = timeToString(time.minute) + ":" + timeToString(time.second);
};

var stopTimer = function () {
    stop = true;
    clearInterval(intervalID);
    start.innerHTML = 'Start';
};

var timerLoop = function () {
    timeLeft -= 1000;
    updateTimterDisplay(timeLeft);
    if (timeLeft <= 0) {
        stopTimer();
        if (currentTime === workTime) {
            title.innerHTML = 'BREAK';
            notification.notify_unblock();
            currentTime = breakTime;
            if (longBreakTime === 0) {
                currentTime = longBreakTime;
                timeForALongBreak = 2;
            }
        } else if (currentTime === breakTime) {
            timeForALongBreak -= 1;
            title.innerHTML = 'WORK';
            notification.notify_block();
            currentTime = workTime;
        }
        reset.onclick();
    }
};

start.onclick = function () {
    if (!stop) {
        stopTimer();
        return;
    }
    // blocker.cmd('block');
    if (currentTime === workTime) {
        blocker.blockDomains();
    } else if (currentTime === breakTime) {
        blocker.unblockDomains();
    }
    stop = false;
    intervalID = setInterval(timerLoop, 1000);
    start.innerHTML = 'Stop';
};

reset.onclick = function () {
    stopTimer();
    timeLeft = currentTime;
    updateTimterDisplay(timeLeft);
};