# Treffend & Co
Treffend & Co theme gemaakt door Harm en ontworpen door Henk-Jan

## Development

### Setup
1. Make sure you have Node.js installed
2. Run `npm install` to install dependencies

### Development Commands
- `npm run dev` - Build assets once
- `npm run watch` - Watch for changes and rebuild assets
- `npm run bs` - Run BrowserSync only
- `npm run sync` - Run webpack and BrowserSync in parallel
- `npm run start` - Install dependencies and watch for changes
- `npm run start:sync` - Install dependencies and run webpack and BrowserSync
- `npm run prod` - Build assets for production

### BrowserSync
BrowserSync is configured to proxy from the URL set in the `.env` file. By default, it uses:
- Proxy URL: `LOCAL_DEV_URL` from .env (defaults to http://treffend-1.local)
- Port: `BROWSERSYNC_PORT` from .env (defaults to 3000)

To use BrowserSync with webpack watching for changes:
```
npm run sync
```

This will open a browser window with BrowserSync enabled, which will automatically reload when you make changes to PHP, CSS, or JS files.
