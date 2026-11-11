const LOADER_MIN_TIME = 2000;

const startTime = Date.now();

const progress = document.getElementById('loader-progress');

let current = 0;

const interval = setInterval(() => {

    current += 2;

    if (current > 95) {
        current = 95;
    }

    if (progress) {
        progress.style.width = current + '%';
    }

}, 100);

window.addEventListener('load', () => {

    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, LOADER_MIN_TIME - elapsed);

    setTimeout(() => {

        clearInterval(interval);

        if (progress) {
            progress.style.width = '100%';
        }

        setTimeout(() => {

            const loader =
                document.getElementById('app-loader');

            loader.style.opacity = '0';

            setTimeout(() => {
                loader.remove();
            }, 300);

        }, 200);

    }, remaining);

});