<script>

    let { words = [], timing = 100, timeout=1000, class: className } = $props();

    let wordIndex = 0;
    let charIndex = 1;
    let isDeleting = false;

    let word = $state()

    const typeEffect = () => {

        const currentWord = words[wordIndex]
        const currentChars = currentWord.substring(0, charIndex);
        word = currentChars;

        if (!isDeleting && charIndex < currentWord.length) {
            charIndex++;
            setTimeout(typeEffect, timing)
        } else if (isDeleting && charIndex > 0) {
            charIndex--;
            setTimeout(typeEffect, timing/2);
        } else {
            isDeleting = !isDeleting;
            wordIndex = !isDeleting ? (wordIndex + 1) % words.length : wordIndex
            setTimeout(typeEffect, timeout)
        }
    }

    typeEffect()

</script>

<span class={`${className} inline-flex gap-x-2`}>
    {word}
    <span class={`font-extralight ${words[wordIndex].length === charIndex || 0 === charIndex
                ? 'animate-[pulse_0.8s_ease-in-out_infinite]' : ''}`}>|</span>
</span>