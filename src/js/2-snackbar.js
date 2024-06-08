'use strict';

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const form = document.querySelector('.form');

form.addEventListener('submit', submitHandler);

function submitHandler(event) {
    event.preventDefault();

    const delay = parseInt(event.target.delay.value);
    const state = event.target.state.value;

    function createPromise(delay, state) {
        return new Promise((res, rej) => {
            setTimeout(() => {
                if(state === 'fulfilled') {
                    res(delay);
                } else {
                    rej(delay);
                }
            }, delay);
        })
    }

    createPromise(delay, state)
        .then(delay => {
            iziToast.success({
                message: `✅ Fulfilled promise in ${delay}ms`,
                position: 'topRight',
                backgroundColor: 'green',
                messageColor: 'white',
            })
        })
        .catch(delay => {
            iziToast.error({
                message: `❌ Rejected promise in ${delay}ms`,
                position: 'topRight',
                backgroundColor: 'red',
                messageColor: 'white',
            })
        })
}

