class Timer {
    constructor() {
        this.currentDate = new Date();
        this.currentTime = this.currentDate.getTime();
        this.startTime = 0;

        this.duration = 0;

        this.endDate = new Date();
        this.endTime = 0;

        this.isRunning = false;
        this.isStopped = false;
        this.isPaused = false;

        this.interval = null;
    }
}

Timer.prototype.start = (callback) => {
    this.isRunning = true;
    this.isStopped = false;
    this.isPaused = false;

    // Set new start time
    this.currentDate = new Date();
    this.startTime = this.currentDate.getTime();

    this.interval = setInterval(() => {
        this.currentTime = new Date().getTime();
        this.duration = this.currentTime - this.startTime;
    }, 100);

    //A New Observer
    var observer = new Observer(this, "duration")

    observer.Observe(function (newValue) {
        let duration = msToTime(newValue);

        if (callback)
            callback(duration);
    })
};

Timer.prototype.stop = () => {
    this.isRunning = false;
    this.isStopped = true;
    this.isPaused = false;

    this.endDate = new Date();
    this.endTime = this.endDate.getTime();

    clearInterval(this.interval);

    console.log('Stopped', msToTime(this.duration))
};

Timer.prototype.pause = () => {
    this.isRunning = false;
    this.isStopped = false;
    this.isPaused = true;

    this.currentDate = new Date().getTime();

    clearInterval(this.interval);
};

Timer.prototype.resume = () => {
    this.isRunning = true;
    this.isStopped = false;
    this.isPaused = false;

    this.interval = setInterval(() => {
        this.duration++;
    }, 100);
};

Timer.prototype.getDuration = () => {
    return msToTime(this.duration);
};


msToTime = (duration) => {
    var milliseconds = parseInt((duration % 1000) / 100),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return `${hours}:${minutes}:${seconds}.${milliseconds}`
}

function Observer(o, property) {
    var _this = this;
    var value = o[property];
    this.observers = [];

    this.Observe = function (notifyCallback) {
        _this.observers.push(notifyCallback);
    }

    Object.defineProperty(o, property, {
        set: function (val) {
            _this.value = val;
            for (var i = 0; i < _this.observers.length; i++) _this.observers[i](val);
        },
        get: function () {
            return _this.value;
        }
        , configurable: true
    });
}

