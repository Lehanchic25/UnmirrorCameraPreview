/**
 * @name UnmirrorCameraPreview
 * @author Lehanchic25
 * @description Forcibly removes mirroring by applying scaleX(1) to .media-engine-video.
 * @version 1.0.0
 * @source https://github.com/Lehanchic25/UnmirrorCameraPreview
 * @website https://github.com/Lehanchic25/UnmirrorCameraPreview
 * @updateUrl https://raw.githubusercontent.com/Lehanchic25/UnmirrorCameraPreview/refs/heads/main/UnmirrorCameraPreview.plugin.js
 */

//Coder is from Russia, so all of the comments on Russian language
module.exports = class UnmirrorCameraPreview {
    constructor(meta) {
        this.meta = meta;
        this.observer = null;
        this.interval = null;
    }

    start() {
        const applyFix = (element) => {
            // Принудительно применяем scaleX(1)
            element.style.setProperty('transform', 'scaleX(1)', 'important');
            // console.log('Применено исправление:', element); // Убрали вывод
        };

        // Наблюдатель за изменениями DOM
        this.observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.matches('.media-engine-video')) applyFix(node);
                        if (node.querySelectorAll) node.querySelectorAll('.media-engine-video').forEach(applyFix);
                    });
                } else if (mutation.type === 'attributes' && mutation.target.matches('.media-engine-video')) {
                    applyFix(mutation.target);
                }
            });
        });

        this.observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class']
        });

        // Первичная проверка
        document.querySelectorAll('.media-engine-video').forEach(applyFix);
        // console.log('Найдено .media-engine-video:', document.querySelectorAll('.media-engine-video').length); // Убрали вывод

        // Интервал (частота: 250 мс)
        this.interval = setInterval(() => {
            document.querySelectorAll('.media-engine-video').forEach(element => applyFix(element));
        }, 250);
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }

        document.querySelectorAll('.media-engine-video').forEach(element => {
            if (element.style.transform === 'scaleX(1)') {
                element.style.removeProperty('transform');
            }
        });
    }
};
