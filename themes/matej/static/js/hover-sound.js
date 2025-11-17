// Sound effect manager for hover and click interactions
(function () {
    'use strict';

    // Constants
    const STORAGE_KEY = 'soundMuted';
    const SELECTORS = {
        muteButton: '#mute-toggle',
        hoverableItems: '.post-item, .bookmark-item',
        headerLinks: '.site-header nav a'
    };

    const ICONS = {
        muted: '🔇',
        unmuted: '🔊'
    };

    // Sound configuration
    const SOUND_CONFIG = {
        hover: {
            frequency: 1200,
            type: 'sine',
            volume: 0.05,
            fadeVolume: 0.01,
            duration: 0.03
        },
        click: {
            frequency: 880,
            type: 'sine',
            volume: 0.08,
            fadeVolume: 0.01,
            duration: 0.04
        }
    };

    // Sound Manager Class
    class SoundManager {
        constructor() {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext();
            this.isMuted = this.loadMutedState();
        }

        loadMutedState() {
            const stored = localStorage.getItem(STORAGE_KEY);
            // Default to muted (true) if no value is stored
            // Only unmuted if explicitly set to 'false'
            return stored === null ? true : stored !== 'false';
        }

        saveMutedState(isMuted) {
            localStorage.setItem(STORAGE_KEY, isMuted);
        }

        toggleMute() {
            this.isMuted = !this.isMuted;
            this.saveMutedState(this.isMuted);
            return this.isMuted;
        }

        resumeContext() {
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
        }

        play(config) {
            if (this.isMuted) {
                return;
            }

            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.frequency.value = config.frequency;
            oscillator.type = config.type;

            const currentTime = this.audioContext.currentTime;
            gainNode.gain.setValueAtTime(config.volume, currentTime);
            gainNode.gain.exponentialRampToValueAtTime(
                config.fadeVolume,
                currentTime + config.duration
            );

            oscillator.start(currentTime);
            oscillator.stop(currentTime + config.duration);
        }
    }

    // UI Manager Class
    class UIManager {
        constructor(soundManager) {
            this.soundManager = soundManager;
            this.muteButton = document.getElementById(SELECTORS.muteButton.slice(1));
        }

        updateMuteButton() {
            if (!this.muteButton) {
                return;
            }
            this.muteButton.textContent = this.soundManager.isMuted
                ? ICONS.muted
                : ICONS.unmuted;
        }

        attachMuteButtonHandler() {
            if (!this.muteButton) {
                return;
            }

            this.muteButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.soundManager.toggleMute();
                this.updateMuteButton();
            });
        }

        attachHoverSounds() {
            const elements = document.querySelectorAll(SELECTORS.hoverableItems);

            elements.forEach((element) => {
                element.addEventListener('mouseenter', () => {
                    this.soundManager.resumeContext();
                    this.soundManager.play(SOUND_CONFIG.hover);
                });
            });
        }

        attachClickSounds() {
            const links = document.querySelectorAll(SELECTORS.headerLinks);

            links.forEach((link) => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.soundManager.resumeContext();
                    this.soundManager.play(SOUND_CONFIG.click);

                    const href = link.href;
                    const delay = SOUND_CONFIG.click.duration * 1000 + 5;

                    setTimeout(() => {
                        window.location.href = href;
                    }, delay);
                });
            });
        }

        initialize() {
            this.updateMuteButton();
            this.attachMuteButtonHandler();
            this.attachHoverSounds();
            this.attachClickSounds();
        }
    }

    // Initialize on DOM ready
    function init() {
        const soundManager = new SoundManager();
        const uiManager = new UIManager(soundManager);
        uiManager.initialize();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
