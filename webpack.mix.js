const mix = require('laravel-mix');
const glob = require('glob');
require('dotenv').config(); // Load .env file

// Disable success notifications
mix.disableSuccessNotifications();

// Copy static assets
mix.copyDirectory('src/fonts', 'dist/fonts')
   .copyDirectory('src/images', 'dist/images'); // Add this line for images

// Copy SVG directory specifically (if you have one)
if (glob.sync('./src/images/svg').length) {
    mix.copyDirectory('src/images/svg', 'dist/images/svg');
}

// Automatically handle all JavaScript files
const jsFiles = glob.sync('./src/js/*.js');
jsFiles.forEach(file => {
    const fileName = file.split('/').pop(); // Gets the file name with extension
    mix.js(file, 'dist/js');
});

// Main theme styles
mix.sass('src/scss/style.scss', 'dist/css')
   .sass('src/scss/admincss.scss', 'dist/css')
   .sass('src/scss/critical.scss', 'dist/css'); // This will be our critical CSS

// Get all block styles from blocks directory
const blockStyles = glob.sync('./blocks/**/style.scss');

// Compile each block style separately
blockStyles.forEach(file => {
    const blockName = file.split('/')[1]; // Gets 'text' from 'blocks/text/style.scss'
    mix.sass(file, `dist/css/blocks/${blockName}.css`);
});

// Get all block styles from src/scss/03-blocks directory
const srcBlockStyles = glob.sync('./src/scss/03-blocks/_*.scss');

// Add these to the main style.scss compilation
srcBlockStyles.forEach(file => {
    // These are already imported in style.scss, no need to compile separately
});

mix.options({
    processCssUrls: false,
    postCss: [require('autoprefixer')],
    sassOptions: {
        outputStyle: 'compressed'
    },
    // Disable notifications
    notifications: {
        onSuccess: false,
        onFailure: true
    }
})
.sourceMaps(process.env.NODE_ENV !== 'production'); 