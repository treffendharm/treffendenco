import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    resolve: {
        alias: {
            '@gsap': path.resolve(__dirname, 'node_modules/gsap'),
            '@mouse-follower': path.resolve(__dirname, 'node_modules/mouse-follower'),
            '@gsap/Draggable': path.resolve(__dirname, 'node_modules/gsap/Draggable'),
            '@swiper': path.resolve(__dirname, 'node_modules/swiper')
        }
    },
    optimizeDeps: {
        include: ['@studio-freight/lenis', 'gsap', 'mouse-follower', 'gsap/Draggable', 'swiper']
    }
}); 