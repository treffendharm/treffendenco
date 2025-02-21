// Initialize MouseFollower with GSAP
if (typeof MouseFollower !== 'undefined' && typeof gsap !== 'undefined') {
    MouseFollower.registerGSAP(gsap);
    gsap.registerPlugin(ScrollTrigger);

    document.addEventListener('DOMContentLoaded', function () {
        // Get all showreel blocks
        const showreels = document.querySelectorAll('.block-showreel');

        showreels.forEach(showreel => {
            const video = showreel.querySelector('video');
            const overlay = showreel.querySelector('.video-wrapper-overlay');
            const alwaysMuted = video?.dataset.alwaysMuted === 'true';
            const isLooping = video?.hasAttribute('loop');
            
            if (!video || !overlay) return;

            let cursor = null;

            // Initialize cursor for this specific showreel
            function initCursor() {
                if (alwaysMuted) return;

                const videoRect = video.getBoundingClientRect();
                const centerX = videoRect.left + (videoRect.width / 2);
                const centerY = videoRect.top + (videoRect.height / 2) + window.scrollY;

                cursor = new MouseFollower({
                    container: showreel.querySelector('.video-wrapper'), // Scope to this showreel
                    speed: 0.55,
                    ease: 'expo.out',
                    skewing: 0,
                    className: 'mf-cursor',
                    hideOnLeave: true,
                    hiddenState: '-hidden',
                    visible: true,
                    initialPos: [centerX, centerY]
                });
            }

            initCursor();

            // Hide default controls
            video.controls = false;

            // Only add replay button if video is not looping
            if (!isLooping) {
                const replayButton = document.createElement('button');
                replayButton.className = 'video-replay-button';
                replayButton.setAttribute('aria-label', 'Replay video');
                video.parentElement.appendChild(replayButton);

                // Handle replay button click
                function handleReplayClick(e) {
                    e.stopPropagation();
                    video.currentTime = 0;
                    video.play();
                }

                replayButton.addEventListener('click', handleReplayClick);
            }

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
                if (!cursor || alwaysMuted) return;

                if (video.muted) {
                    video.muted = false;
                    video.volume = 0;
                    fadeAudio(0, 1, FADE_DURATION);
                    cursor.addState('-unmuted');
                    cursor.removeState('-muted');
                } else {
                    fadeAudio(video.volume, 0, FADE_DURATION, () => {
                        video.muted = true;
                        video.volume = 1;
                    });
                    cursor.addState('-muted');
                    cursor.removeState('-unmuted');
                }
            }

            // Only add click listener if not always muted
            if (!alwaysMuted) {
                video.addEventListener('click', handleVideoClick);
            }

            // Update cursor state on hover only if not always muted
            if (!alwaysMuted) {
                video.addEventListener('mouseenter', () => {
                    if (!cursor) return;
                    cursor.addState('-muted');
                });

                video.addEventListener('mouseleave', () => {
                    if (!cursor) return;
                    cursor.removeState('-muted');
                    cursor.removeState('-unmuted');
                });
            }

            // Cleanup cursor when video is out of view
            function cleanupCursor() {
                if (cursor) {
                    cursor.destroy();
                    cursor = null;
                }
            }

            const THRESHOLD = 0.7;
            const FADE_DURATION = 500;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && entry.intersectionRatio >= THRESHOLD) {
                        video.volume = 1;
                        video.muted = true;
                        video.play();
                        overlay.classList.add('is-hidden');

                        if (!alwaysMuted && !cursor) {
                            initCursor();
                        }
                        if (cursor && !alwaysMuted) {
                            cursor.addState('-muted');
                        }
                    } else {
                        if (!video.muted) {
                            fadeAudio(video.volume, 0, FADE_DURATION, () => {
                                video.pause();
                                video.volume = 1;
                                video.muted = true;
                            });
                        } else {
                            video.pause();
                        }
                        overlay.classList.remove('is-hidden');
                        cleanupCursor();
                    }
                });
            }, {
                threshold: THRESHOLD,
                rootMargin: '0px'
            });

            observer.observe(video);
        });
    });
}
