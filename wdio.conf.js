const path = require('path');
const fs = require('fs-extra');
const { spawn } = require('child_process');
const axios = require('axios');

exports.config = {
    runner: 'local',
    specs: ['./features/**/*.feature'],
    exclude: [],
    maxInstances: 1,
    automationProtocol: 'devtools',
    capabilities: [{
        browserName: 'chrome',
        acceptInsecureCerts: true,
        'goog:chromeOptions': {
            debuggerAddress: '127.0.0.1:9222'
        }
    }],
    logLevel: 'info',
    bail: 0,
    baseUrl: 'http://localhost:8081',
    waitforTimeout: 60000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    services: ['devtools'], // No chromedriver or selenium
    framework: 'cucumber',
    reporters: ['spec'],
    cucumberOpts: {
        require: ['./step-definitions/**/*.js'],
        timeout: 60000
    },

    // === Hook for setup
    onPrepare: async function () {
        // Force-disable any chromedriver activity
        process.env.CHROMEDRIVER_SKIP_DOWNLOAD = 'true';
        process.env.WDIO_DISABLE_CHROMEDRIVER = 'true';

        const screenshotDir = path.join(process.cwd(), 'screenshots');
        console.log('>>> automationProtocol:', exports.config.automationProtocol);
        await fs.ensureDir(screenshotDir);

        let debugPortAvailable = false;
        try {
            const response = await axios.get('http://127.0.0.1:9222/json', { timeout: 2000 })
                .catch(() => axios.get('http://[::1]:9222/json', { timeout: 2000 }));
            if (response && response.status === 200) {
                console.log('Debug port 9222 is already available, no need to launch OpenFin');
                debugPortAvailable = true;
            }
        } catch {
            console.log('Debug port not available, will launch OpenFin application');
        }

        if (!debugPortAvailable) {
            await launchOpenFinApplication();
            await new Promise(resolve => setTimeout(resolve, 15000));
        }
    },

    beforeFeature: function (uri, feature) {
        console.log(`Running feature: ${feature.name}`);
    },

    afterStep: async function (step, scenario, { error }) {
        if (error) {
            const screenshotPath = path.join(process.cwd(), 'screenshots', `${step.text.replace(/\s+/g, '_')}_failed.png`);
            await browser.saveScreenshot(screenshotPath);
            console.log(`Screenshot taken: ${screenshotPath}`);
        }
    }
};

async function launchOpenFinApplication() {
    return new Promise((resolve, reject) => {
        const batFilePath = 'C:\\Merlin\\launch_openfin_fo_dev.bat';
        if (!fs.existsSync(batFilePath)) {
            console.error(`Batch file not found: ${batFilePath}`);
            return reject(new Error(`Batch file not found: ${batFilePath}`));
        }

        console.log(`Launching OpenFin application using batch file: ${batFilePath}`);
        try {
            spawn('taskkill', ['/f', '/im', 'OpenFin.exe'], { shell: true });
            spawn('taskkill', ['/f', '/im', 'OpenFinRVM.exe'], { shell: true });

            setTimeout(() => {
                try {
                    const child = spawn(batFilePath, { shell: true });
                    child.stdout.on('data', data => console.log(`OpenFin stdout: ${data}`));
                    child.stderr.on('data', data => console.error(`OpenFin stderr: ${data}`));
                    child.on('error', err => reject(err));
                    console.log('OpenFin launch initiated...');
                    resolve();
                } catch (err) {
                    reject(err);
                }
            }, 2000);
        } catch (err) {
            console.warn('Failed to kill existing processes, proceeding...');
            resolve();
        }
    });
}
