import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
    return String(value).padStart(2, '0');
}

let userSelectedDate = null;
const startButton = document.querySelector('[data-start]');
startButton.disabled = true;
const datetimePicker = document.querySelector('#datetime-picker');

flatpickr(datetimePicker, {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        userSelectedDate = selectedDates[0];

        if (userSelectedDate < Date.now()) {
            iziToast.error({
                title: 'Error',
                message: 'Please choose a date in the future',
                position: 'topRight',
            });
            startButton.disabled = true;
            startButton.classList.remove('active'); 
        } else {
            startButton.disabled = false;
            startButton.classList.add('active')
        }
    },
});

let timerInterval = null;

startButton.addEventListener('click', () => {
    startButton.disabled = true;
    datetimePicker.disabled = true;
    startButton.classList.remove('active');

    timerInterval = setInterval(() => {
        const currentTime = Date.now();
        const timeLeft = userSelectedDate - currentTime;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            updateTimerDisplay(0, 0, 0, 0);
            datetimePicker.disabled = false;
            return;
        }

        const { days, hours, minutes, seconds } = convertMs(timeLeft);
        updateTimerDisplay(days, hours, minutes, seconds);
    }, 1000);
});

function updateTimerDisplay(days, hours, minutes, seconds) {
    document.querySelector('[data-days]').textContent = addLeadingZero(days);
    document.querySelector('[data-hours]').textContent = addLeadingZero(hours);
    document.querySelector('[data-minutes]').textContent = addLeadingZero(minutes);
    document.querySelector('[data-seconds]').textContent = addLeadingZero(seconds);
}
