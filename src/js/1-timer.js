'use strict';

import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const datetimePicker = document.querySelector('#datetime-picker');
const clockfaceDays = document.querySelector('[data-days]');
const clockfaceHours = document.querySelector('[data-hours]');
const clockfaceMinutes = document.querySelector('[data-minutes]');
const clockfaceSeconds = document.querySelector('[data-seconds]');
const startBtn = document.querySelector('button[data-start]');
startBtn.disabled = true;

let userSelectedDate = null;

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        console.log(selectedDates[0]);

        userSelectedDate = new Date(selectedDates[0]);
        if(userSelectedDate < Date.now()) {
            startBtn.disabled = true;
            iziToast.error({
                title: 'Error',
                titleColor: 'white',
                message: 'Please choose a date in the future',
                messageColor: 'white',
                position: 'topRight',
                backgroundColor: 'red',
            });
            return;
        }

        startBtn.disabled = false;
    },
};

class Timer {
    constructor() {
        this.interval = null;
    }

    start() {
        startBtn.disabled = true;
        datetimePicker.disabled = true;

        const targetTime = userSelectedDate.getTime();
        this.interval = setInterval(() => {
            const currentTime = Date.now();
            const delta = targetTime - currentTime;

            if (delta <= 0) {
                clearInterval(this.interval);
                this.updateClockface({ days: '00', hours: '00', minutes: '00', seconds: '00' })
                datetimePicker.disabled = false;
                return;
            }

            const time = this.convertMs(delta);
            this.updateClockface(time);
        }, 1000);
    }

    convertMs(ms) {
        const second = 1000;
        const minute = second * 60;
        const hour = minute * 60;
        const day = hour * 24;
    
        const days = this.addLeadingZero(Math.floor(ms / day));
        const hours = this.addLeadingZero(Math.floor((ms % day) / hour));
        const minutes = this.addLeadingZero(Math.floor(((ms % day) % hour) / minute));
        const seconds = this.addLeadingZero(Math.floor((((ms % day) % hour) % minute) / second));
    
        return { days, hours, minutes, seconds };
    }

    addLeadingZero(value) {
        return String(value).padStart(2, '0');
    }

    updateClockface({ days, hours, minutes, seconds }) {
        clockfaceDays.textContent = days;
        clockfaceHours.textContent = hours;
        clockfaceMinutes.textContent = minutes;
        clockfaceSeconds.textContent = seconds;
    }
}
const timer = new Timer();

startBtn.addEventListener("click", timer.start.bind(timer));

flatpickr("#datetime-picker", options);
