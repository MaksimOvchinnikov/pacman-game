
export class SoundManager {
    clips = {};
    context = null;
    gainNode = null;


    async init() {
        this.context = new AudioContext();
        this.gainNode = this.context.createGain()
        this.gainNode.connect(this.context.destination);
    }

    load(path, callback) {
        const request = new XMLHttpRequest();
        request.open('GET', path, true);
        request.responseType = 'arraybuffer';

        request.onload = () => {
            this.context.decodeAudioData(request.response, (buffer) => {
                if (buffer) {
                    this.clips[path] = { buffer };
                    if (callback) callback();
                } else {
                    console.error(`Error decoding audio data for "${path}".`);
                }
            });
        };

        request.onerror = () => {
            console.error(`Failed to load audio clip "${path}".`);
        };


        request.send();
    }

    async loadArray(array) {
        const loadPromises = array.map((path) => {
            return new Promise((resolve) => {
                this.load(path, resolve);
            });
        });

        return Promise.all(loadPromises);
    }

    play(path, settings = {}) {
        if (!this.clips[path]) {
            console.error(`Audio clip "${path}" not loaded.`);
            return;
        }

        const { volume = 1, loop = false } = settings;

        const source = this.context.createBufferSource();
        source.buffer = this.clips[path].buffer;
        source.connect(this.gainNode);
        source.loop = loop;

        this.gainNode.gain.value = volume;

        source.start(0);
        if (loop) {
            source.stop(this.context.currentTime + 1000);
        }

        return source;
    }
}