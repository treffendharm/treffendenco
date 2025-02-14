// Initialize MouseFollower with GSAP
if (typeof MouseFollower !== 'undefined' && typeof gsap !== 'undefined') {
    MouseFollower.registerGSAP(gsap);
    gsap.registerPlugin(ScrollTrigger);

    // Add a flag to prevent double initialization
    if (!window.showreelInitialized) {
        window.showreelInitialized = true;

        document.addEventListener('DOMContentLoaded', function () {
            const THRESHOLD = 0.7;
            const FADE_DURATION = 500; // 500ms fade duration
            const video = document.querySelector('.block-showreel video');
            const overlay = document.querySelector('.block-showreel .video-wrapper-overlay');
            if (!video || !overlay) return;

            let cursor = null;

            // Initialize cursor only for showreel block
            function initCursor() {
                const videoRect = video.getBoundingClientRect();
                const centerX = videoRect.left + (videoRect.width / 2);
                const centerY = videoRect.top + (videoRect.height / 2) + window.scrollY;

                cursor = new MouseFollower({
                    container: '.video-wrapper',
                    speed: 0.55,
                    ease: 'expo.out',
                    skewing: 0,
                    className: 'mf-cursor',
                    hideOnLeave: true,
                    hiddenState: '-hidden',
                    visible: true,
                    initialPos: [centerX, centerY] // Set initial position to center
                });
            }

            initCursor();

            // Hide default controls
            video.controls = false;

            // Add replay button
            const replayButton = document.createElement('button');
            replayButton.className = 'video-replay-button';
            replayButton.setAttribute('aria-label', 'Replay video');
            video.parentElement.appendChild(replayButton);

            // Function to smoothly fade audio
            function fadeAudio(from, to, duration, callback) {
                const start = performance.now();

                function updateVolume(currentTime) {
                    const elapsed = currentTime - start;
                    const progress = Math.min(elapsed / duration, 1);

                    video.volume = Math.min(Math.max(from + (to - from) * progress, 0), 1);

                    if (progress < 1) {
                        requestAnimationFrame(updateVolume);
                    } else {
                        if (callback) callback();
                    }
                }

                requestAnimationFrame(updateVolume);
            }

            // Handle click on video for mute/unmute
            function handleVideoClick() {
                console.log('clicked the video')
                if (!cursor) return;

                if (video.muted) {
                    // Unmute and fade in volume
                    video.muted = false;
                    video.volume = 0; // Start from 0
                    fadeAudio(0, 1, FADE_DURATION);
                    cursor.addState('-unmuted');
                    cursor.removeState('-muted');
                } else {
                    // Fade out and then mute
                    fadeAudio(video.volume, 0, FADE_DURATION, () => {
                        video.muted = true;
                        video.volume = 1; // Reset volume for next unmute
                    });
                    cursor.addState('-muted');
                    cursor.removeState('-unmuted');
                }
            }

            // Handle replay button click
            function handleReplayClick(e) {
                e.stopPropagation(); // Prevent triggering video click
                video.currentTime = 0;
                video.play();
            }

            video.addEventListener('click', handleVideoClick);
            replayButton.addEventListener('click', handleReplayClick);

            // Update cursor state on hover
            video.addEventListener('mouseenter', () => {
                if (!cursor) return;
                // cursor.addState(video.muted ? '-muted' : '-unmuted');
            });

            video.addEventListener('mouseleave', () => {
                if (!cursor) return;
                // cursor.removeState('-muted');
                // cursor.removeState('-unmuted');
            });

            // Cleanup cursor when video is out of view
            function cleanupCursor() {
                if (cursor) {
                    cursor.destroy();
                    cursor = null;
                }
            }

            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    // Only play when the intersection ratio is above 70%
                    if (entry.isIntersecting && entry.intersectionRatio >= THRESHOLD) {
                        // Start with muted state but full volume
                        video.volume = 1;
                        video.muted = true;
                        video.play();
                        overlay.classList.add('is-hidden');

                        // Reinitialize cursor if needed
                        if (!cursor) {
                            initCursor();
                        }
                        if (cursor) {
                            cursor.addState('-muted');
                        }
                    } else {
                        // If video is not muted, fade out the audio
                        if (!video.muted) {
                            fadeAudio(video.volume, 0, FADE_DURATION, () => {
                                video.pause();
                                // Reset volume to full and mute for next play
                                video.volume = 1;
                                video.muted = true;
                            });
                        } else {
                            // If already muted, just pause
                            video.pause();
                        }
                        overlay.classList.remove('is-hidden');
                        cleanupCursor(); // Cleanup cursor when out of view
                    }
                });
            }, {
                threshold: THRESHOLD,
                rootMargin: '0px'
            });

            observer.observe(video);

            console.log('Showreel initialized'); // This should now only log once
        });
    }
}
