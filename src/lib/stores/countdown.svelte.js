
import { getContext, setContext } from "svelte";

class Countdown {

    totalSeconds = $state()

    constructor(countdownToDate) {

        let currentDate = new Date();
        this.totalSeconds = Math.floor((countdownToDate - currentDate) / 1000)
        
    }

    seconds = $derived(this.totalSeconds % 60)
    minutes = $derived((((this.totalSeconds-this.seconds)) / 60) % 60)
    hours = $derived((((((this.totalSeconds-this.seconds)) / 60) - this.minutes) / 60) % 24)
    days = $derived(((((((this.totalSeconds-this.seconds)) / 60) - this.minutes) / 60) - this.hours) / 24)

    startCountdown() {

        this.stopCountdown = setInterval(() => {
            this.totalSeconds = (this.totalSeconds - 1)
        }, 990)

    }

    getTotalSeconds() {
        return this.totalSeconds;
    }

}

export const createCountdown = (date) => {
    return new Countdown(date)
}
