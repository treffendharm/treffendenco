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
        '**/*.php',
        'src/images/**/*'
    ]
});

// Log URLs initially
logBrowserSyncUrls();

// Log URLs every 30 seconds to keep them visible
setInterval(logBrowserSyncUrls, 30000);

// Also log URLs when files change
server.watch([
    'dist/**/*.css',
    'dist/**/*.js',
    '**/*.php',
    'src/images/**/*'
]).on('change', function(file) {
    console.log(chalk.magenta(`File changed: ${file}`));
    logBrowserSyncUrls();
}); 