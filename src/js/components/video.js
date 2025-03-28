import MouseFollower from 'mouse-follower';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);
MouseFollower.registerGSAP(gsap);

// if mouseFollower is not found, log an error
if (!MouseFollower) {
    console.error('MouseFollower is not found');
}


const mobileQuery = window.matchMedia('(max-width: 767px)');
let isMobile = mobileQuery.matches;
const observerThreshold = 0.7;
const fadeDuration = 500;

document.addEventListener('DOMContentLoaded', function () {
    const videos = getAllVideos();
    // Create Maps to store instances for each video wrapper
    const cursorMap = new Map();
    const observerMap = new Map();
    const desktopClickListenerMap = new Map();
    const mobileClickListenerMap = new Map();  // Store mobile click listeners

    handleVideoFormat(isMobile, videos);

    mobileQuery.addEventListener('change', () => {
        isMobile = mobileQuery.matches;
        handleVideoFormat(isMobile, videos);
    });

    function handleVideoFormat(isMobile, videos) {
        if (isMobile) {
            handleVideoForMobile(videos, cursorMap);
        } else {
            handleVideoForDesktop(videos, cursorMap);
        }
    }

    function handleVideoForMobile(videos, cursorMap) {
        videos.forEach(wrapper => {
            // Destroy cursor if it exists
            const cursor = cursorMap.get(wrapper);
            if (cursor) {
                cursor.destroy();
                cursorMap.delete(wrapper);
            }

            // Disconnect observer if it exists
            const observer = observerMap.get(wrapper);
            if (observer) {
                observer.disconnect();
                observerMap.delete(wrapper);
            }

            // Remove desktop click listener if it exists
            const video = wrapper.querySelector('video');
            const desktopClickListener = desktopClickListenerMap.get(wrapper);
            if (desktopClickListener && video) {
                video.removeEventListener('click', desktopClickListener);
                desktopClickListenerMap.delete(wrapper);
            }

            const overlay = wrapper.querySelector('.video-wrapper-overlay');
            if (!video || !overlay) return; // If there is no video overlay, the video will always play muted on repeat. so no extra logic is needed.

            video.setAttribute('disablePictureInPicture', 'true');
            video.setAttribute('controlsList', 'nodownload');
            video.controls = false;

            const playButton = document.createElement('button');
            playButton.className = 'video-play-button';
            playButton.setAttribute('aria-label', 'Play video');
            playButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="61" viewBox="0 0 60 61" fill="none"><circle cx="30" cy="30.4172" r="30" fill="#D1C2FF"/><path d="M43 30.4173L24.1245 41.3151L24.1245 19.5195L43 30.4173Z" fill="black"/></svg>`;
            wrapper.appendChild(playButton);

            if (!video.paused) {
                video.pause();
                playButton.style.display = 'flex';
                overlay.classList.remove('is-hidden');
            }

            // Store mobile click handlers
            const mobileVideoClickHandler = () => {
                if (video.paused) {
                    video.play();
                    video.muted = false;
                    playButton.style.display = 'none';
                    overlay.classList.add('is-hidden');
                } else {
                    video.pause();
                    playButton.style.display = 'flex';
                    overlay.classList.remove('is-hidden');
                }
            };

            const mobilePlayButtonClickHandler = () => {
                video.play();
                video.muted = false;
                playButton.style.display = 'none';
                overlay.classList.add('is-hidden');
            };

            // Store both handlers in the Map as an object
            mobileClickListenerMap.set(wrapper, {
                videoClick: mobileVideoClickHandler,
                playButtonClick: mobilePlayButtonClickHandler
            });

            playButton.addEventListener('click', mobilePlayButtonClickHandler);
            video.addEventListener('click', mobileVideoClickHandler);
        });
    }

    function handleVideoForDesktop(videos, cursorMap) {
        videos.forEach(wrapper => {
            // Remove mobile click listeners if they exist
            const mobileListeners = mobileClickListenerMap.get(wrapper);
            if (mobileListeners) {
                const video = wrapper.querySelector('video');
                const playButton = wrapper.querySelector('.video-play-button');

                if (video) {
                    video.removeEventListener('click', mobileListeners.videoClick);
                }
                if (playButton) {
                    playButton.removeEventListener('click', mobileListeners.playButtonClick);
                }
                mobileClickListenerMap.delete(wrapper);
            }

            // Remove play button if it exists
            const existingPlayButton = wrapper.querySelector('.video-play-button');
            if (existingPlayButton) {
                existingPlayButton.remove();
            }

            const video = wrapper.querySelector('video');
            const overlay = wrapper.querySelector('.video-wrapper-overlay');
            if (!video || !overlay) return; // If there is no video overlay, the video will always play muted on repeat. so no extra logic is needed.

            video.setAttribute('disablePictureInPicture', 'true');
            video.setAttribute('controlsList', 'nodownload nofullscreen');
            video.controls = false;

            const alwaysMuted = video.dataset.alwaysMuted === 'true';
            const isLooping = video.hasAttribute('loop');
            let cursor = null;




            // Let add some controls for the video, like is it not always muted add a cursor, if it is not looping add a replay button.
            function createCursor(wrapper, video, alwaysMuted) {
                if (alwaysMuted === false) { // Only create a cursor if the video is not always muted.
                    const videoRect = video.getBoundingClientRect();
                    const centerX = videoRect.left + (videoRect.width / 2);
                    const centerY = videoRect.top + (videoRect.height / 2) + window.scrollY;

                    const cursor = new MouseFollower({
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

                    // Store the cursor instance in the Map
                    cursorMap.set(wrapper, cursor);
                    return cursor;
                }

                return null;
            }

            if (!isLooping) {
                const replayButton = document.createElement('button');
                replayButton.className = 'video-replay-button';
                replayButton.setAttribute('aria-label', 'Replay video');
                wrapper.appendChild(replayButton);

                replayButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    video.currentTime = 0;
                    video.play();
                    if (mobileQuery.matches) {
                        playButton.style.display = 'none';
                    }
                });
            }

            function handleVideoClick() {
                console.log('handleVideoClick');
                if (alwaysMuted) return; // If it is always muted, we do not need to check for a click, becuase we will not unmute it.

                if (video.muted) {
                    video.muted = false;
                    video.volume = 0; // Set to 0, so we can fade the audio in.
                    fadeAudio(0, 1, fadeDuration);
                    cursor.addState('-unmuted');
                    cursor.removeState('-muted');
                } else {
                    fadeAudio(video.volume, 0, fadeDuration, () => {
                        video.muted = true;
                        video.volume = 1;
                    });
                    cursor.addState('-muted');
                    cursor.removeState('-unmuted');
                }
            }

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


            // Check if the video is in the viewport, if it is, we play the video and hide the overlay if there is one.
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && entry.intersectionRatio >= observerThreshold) {
                        video.volume = 1;
                        video.muted = true;

                        video.play().catch(() => {
                            // Handle autoplay failure
                            console.log('Autoplay prevented');
                        });
                        overlay.classList.add('is-hidden');
                        if (!cursor) { // If there is no cursor yet, we create one.
                            cursor = createCursor(wrapper, video, alwaysMuted);
                            cursor.addState('-muted');
                        }
                    } else {
                        if (!video.muted) {
                            fadeAudio(video.volume, 0, fadeDuration, () => {
                                video.pause();
                                video.volume = 1;
                                video.muted = true;
                            });
                            setTimeout(() => {
                                cursor.addState('-muted');
                                cursor.removeState('-unmuted');
                            }, 200);
                        } else {
                            video.pause();
                        }
                        overlay.classList.remove('is-hidden');
                    }
                });
            }, {
                threshold: observerThreshold,
                rootMargin: '0px'
            });

            // Store the observer instance in the Map
            observerMap.set(wrapper, observer);
            observer.observe(video);

            // Store the desktop click listener
            desktopClickListenerMap.set(wrapper, handleVideoClick);
            video.addEventListener('click', handleVideoClick);
        });
    }




    // Helper functions
    function getAllVideos() {
        const mediaRows = document.querySelectorAll('.media-wrapper');
        const videoWrappers = [];
        mediaRows.forEach(mediaRow => {
            const videos = mediaRow.querySelectorAll('.video-wrapper');
            videos.forEach(video => {
                videoWrappers.push(video);
            });
        });
        return videoWrappers;
    }
});