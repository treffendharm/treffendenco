// Initialize MouseFollower with GSAP
import MouseFollower from 'mouse-follower';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);
MouseFollower.registerGSAP(gsap);

document.addEventListener('DOMContentLoaded', function () {
    // Check if device is mobile based on screen width
    const checkIsMobile = () => window.innerWidth < 768;
    let isMobile = checkIsMobile();
    
    // Update isMobile on resize
    window.addEventListener('resize', () => {
        isMobile = checkIsMobile();
        updateVideoStates();
    });
    
    // Get all media row blocks
    const mediaRows = document.querySelectorAll('.media-wrapper');
    const videoElements = [];

    // Function to update all video states based on current mobile status
    function updateVideoStates() {
        videoElements.forEach(({ video, playButton, overlay, wrapper, alwaysMuted, isLooping, cursor }) => {
            // Update play button visibility
            if (isMobile && video.paused) {
                playButton.style.display = 'flex';
            } else if (!isMobile && video.paused) {
                playButton.style.display = 'none';
            }
            
            // Update replay button visibility if it exists
            if (!isLooping) {
                const replayButton = wrapper.querySelector('.video-replay-button');
                if (replayButton) {
                    replayButton.style.display = isMobile ? 'none' : 'block';
                }
            }
            
            // Clean up cursor on mobile
            if (isMobile && cursor) {
                cursor.destroy();
                cursor = null;
            }
            
            // Initialize cursor on desktop if needed
            if (!isMobile && !cursor && !alwaysMuted && isElementInViewport(video)) {
                initCursor(wrapper, video, alwaysMuted);
            }
        });
    }
    
    // Helper function to check if element is in viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    mediaRows.forEach(mediaRow => {
        // Find all video wrappers within this media row
        const videoWrappers = mediaRow.querySelectorAll('.video-wrapper');

        videoWrappers.forEach(wrapper => {
            const video = wrapper.querySelector('video');
            const overlay = wrapper.querySelector('.video-wrapper-overlay');

            if (!video || !overlay) return;

            const alwaysMuted = video.dataset.alwaysMuted === 'true';
            const isLooping = video.hasAttribute('loop');
            let cursor = null;

            // Disable fullscreen mode
            video.setAttribute('disablePictureInPicture', 'true');
            video.setAttribute('controlsList', 'nodownload nofullscreen');
            
            // Add play button for mobile
            const playButton = document.createElement('button');
            playButton.className = 'video-play-button';
            playButton.setAttribute('aria-label', 'Play video');
            playButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="61" viewBox="0 0 60 61" fill="none"><circle cx="30" cy="30.4172" r="30" fill="#D1C2FF"/><path d="M43 30.4173L24.1245 41.3151L24.1245 19.5195L43 30.4173Z" fill="black"/></svg>`;
            wrapper.appendChild(playButton);
            
            // Show play button on mobile or when video is paused
            if (isMobile) {
                playButton.style.display = 'flex';
            } else {
                playButton.style.display = 'none';
            }
            
            // Store video elements for later updates
            videoElements.push({
                video,
                playButton,
                overlay,
                wrapper,
                alwaysMuted,
                isLooping,
                cursor
            });

            // Initialize cursor for this specific video
            function initCursor(wrapper, video, alwaysMuted) {
                if (alwaysMuted || isMobile) return null;

                const videoRect = video.getBoundingClientRect();
                const centerX = videoRect.left + (videoRect.width / 2);
                const centerY = videoRect.top + (videoRect.height / 2) + window.scrollY;

                const newCursor = new MouseFollower({
                    container: wrapper,
                    speed: 0.55,
                    ease: 'expo.out',
                    skewing: 0,
                    className: 'mf-cursor',
                    hideOnLeave: true,
                    hiddenState: '-hidden',
                    visible: true,
                    initialPos: [centerX, centerY]
                });
                
                return newCursor;
            }

            // Hide default controls
            video.controls = false;

            // Only add replay button if video is not looping
            if (!isLooping) {
                const replayButton = document.createElement('button');
                replayButton.className = 'video-replay-button';
                replayButton.setAttribute('aria-label', 'Replay video');
                wrapper.appendChild(replayButton);
                
                // Hide replay button on mobile
                if (isMobile) {
                    replayButton.style.display = 'none';
                }
                
                // Update replay button visibility on resize
                window.addEventListener('resize', () => {
                    if (checkIsMobile()) {
                        replayButton.style.display = 'none';
                    } else {
                        replayButton.style.display = 'block';
                    }
                });

                replayButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    video.currentTime = 0;
                    video.play();
                    if (isMobile) {
                        playButton.style.display = 'none';
                    }
                });
            }

            // Play button click handler
            playButton.addEventListener('click', (e) => {
                e.stopPropagation();
                video.play().then(() => {
                    playButton.style.display = 'none';
                    overlay.classList.add('is-hidden');
                }).catch(error => {
                    console.error('Error playing video:', error);
                });
            });

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
                if (!cursor || alwaysMuted || isMobile) return;

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

            // Only add click listener if not always muted and not on mobile
            if (!alwaysMuted && !isMobile) {
                video.addEventListener('click', handleVideoClick);
            } else if (isMobile) {
                // On mobile, clicking the video toggles play/pause
                video.addEventListener('click', () => {
                    if (video.paused) {
                        video.play();
                        playButton.style.display = 'none';
                    } else {
                        video.pause();
                        playButton.style.display = 'flex';
                    }
                });
            }

            // Update cursor state on hover only if not always muted and not on mobile
            if (!alwaysMuted && !isMobile) {
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

            // Show play button when video ends
            video.addEventListener('ended', () => {
                if (isMobile && !isLooping) {
                    playButton.style.display = 'flex';
                }
            });

            // Cleanup cursor when video is out of view
            function cleanupCursor() {
                if (cursor) {
                    cursor.destroy();
                    cursor = null;
                }
            }

            const THRESHOLD = 0.7;
            const FADE_DURATION = 500;

            // Create an intersection observer for each video
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && entry.intersectionRatio >= THRESHOLD) {
                        video.volume = 1;
                        video.muted = true;
                        
                        // Only autoplay on desktop, not on mobile
                        if (!isMobile) {
                            video.play().catch(() => {
                                // Handle autoplay failure
                                console.log('Autoplay prevented');
                            });
                            overlay.classList.add('is-hidden');
                        } else {
                            // On mobile, show play button instead of autoplaying
                            playButton.style.display = 'flex';
                            overlay.classList.remove('is-hidden');
                        }

                        if (!alwaysMuted && !isMobile && !cursor) {
                            cursor = initCursor(wrapper, video, alwaysMuted);
                        }
                        if (cursor && !alwaysMuted && !isMobile) {
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
                        if (isMobile) {
                            playButton.style.display = 'flex';
                        }
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
});
