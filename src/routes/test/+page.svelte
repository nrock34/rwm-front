<script>

    import { createCountdown } from '$lib/stores/countdown.svelte.js';


    let countdown = createCountdown(new Date('2025-10-12T09:30:00Z'));
    countdown.startCountdown()

    let tempNum = 9;


</script>


<div class="flex gap-x-5 px-10">
    <div class="flex flex-col items-center">
        <span class="text-7xl text-primary font-semibold">{countdown.days}</span>
        <p>Days</p>
    </div>
    <div class="flex flex-col items-center">
        <span class="text-7xl text-primary font-semibold">{countdown.hours}</span>
        <p>Hours</p>
    </div>
    <div class="flex flex-col items-center">
        <span class="text-7xl text-primary font-semibold">{countdown.minutes}</span>
        <p>Minutes</p>
    </div>
    <div class="flex flex-col items-center">
        <span class="text-7xl text-primary font-semibold flex">
            <span>
                {#if countdown.seconds < 10}
                    0
                {/if}
            </span>
            <span class="">  
                {countdown.seconds}
            </span>
        </span>
        <p>Seconds</p>
    </div>
</div>


