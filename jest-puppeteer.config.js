module.exports = {
  server: {
    command: `serve -s build`,
    port: 5000,
    launchTimeout: 10000,
    debug: true,
  },
  launch: {
    dumpio: true,
    headless: true,
    args: [`--window-size=${800},${800}`]
  },
  browser: 'chromium',
  browserContext: 'default',
}