require('dotenv').config();
const browserSync = require('browser-sync');
const chalk = require('chalk'); // For colored console output
const os = require('os'); // For getting network interfaces

// Create a BrowserSync instance
const server = browserSync.create();

// Get the URLs
const proxyUrl = process.env.LOCAL_DEV_URL || 'http://treffend-1.local';
const port = process.env.BROWSERSYNC_PORT || 3000;
const localUrl = `http://localhost:${port}`;

// Get the local IP address for external URL
function getLocalIpAddress() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            // Skip over non-IPv4 and internal (loopback) addresses
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return '0.0.0.0'; // Fallback
}

const externalUrl = `http://${getLocalIpAddress()}:${port}`;

// Function to log BrowserSync URLs with clear formatting
function logBrowserSyncUrls() {
    console.log('\n');
    console.log(chalk.green('--------------------------------------'));
    console.log(chalk.green.bold('🔄 BrowserSync is running!'));
    console.log(chalk.green('--------------------------------------'));
    console.log(chalk.cyan('Local URL:    ') + chalk.yellow(localUrl));
    console.log(chalk.cyan('External URL: ') + chalk.yellow(externalUrl));
    console.log(chalk.cyan('Proxy URL:    ') + chalk.yellow(proxyUrl));
    console.log(chalk.green('--------------------------------------'));
    console.log('\n');
}

// Initialize BrowserSync
server.init({
    proxy: proxyUrl,
    port: port,
    open: true,
    notify: false,
    logLevel: "info",
    logPrefix: "BrowserSync",
    logConnections: true,
    files: [
        'dist/**/*.css',
        'dist/**/*.js',
        'dist/css/blocks/**/*.css', // Specifically watch compiled block CSS
        'blocks/**/*.scss', // Watch block SCSS files directly
        'blocks/**/style.scss', // Explicitly watch block style.scss files
        '**/*.php',
        'src/images/**/*'
    ],
    // Add a file watcher with callback for debugging
    watchEvents: ['change', 'add', 'unlink'],
    callbacks: {
        files: function(event, file) {
            // Log file changes for debugging
            if (file.includes('blocks') && file.includes('.scss')) {
                console.log(chalk.yellow(`Block SCSS file changed: ${file}`));
            }
        }
    }
});

// Log URLs only at startup
logBrowserSyncUrls();

// Add a specific watcher for block SCSS files
server.watch('blocks/**/style.scss').on('change', function(file) {
    console.log(chalk.magenta(`Block style changed: ${file}`));
    // Force a reload
    server.reload();
}); 