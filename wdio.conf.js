const path = require('path');
const fs = require('fs-extra');
// In the launchOpenFinApplication function:
const batFilePath = 'C:\\Merlin\\launch_openfin_fo_dev.bat'; 
const { spawn } = require('child_process');

exports.config = {
    //
    // ====================
    // Runner Configuration
    // ====================
    //
    runner: 'local',
    //
    // ==================
    // Specify Test Files
    // ==================
    specs: [
        './features/**/*.feature'
    ],
    // Patterns to exclude.
    exclude: [
        // 'path/to/excluded/files'
    ],
    //
    // ============
    // Capabilities
    // ============
    maxInstances: 1,
    capabilities: [{
        maxInstances: 1,
        browserName: 'chrome',
        acceptInsecureCerts: true,
        'goog:chromeOptions': {
            // Connect to existing Chrome instance with debug port
            debuggerAddress: '127.0.0.1:9222',
        }
    }],
    //
    // ===================
    // Test Configurations
    // ===================
    // Level of logging verbosity: trace | debug | info | warn | error | silent
    logLevel: 'info',
    bail: 0,
    baseUrl: 'http://localhost:8081',
    waitforTimeout: 60000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    services: [
        ['chromedriver', {
            chromedriverCustomPath: './node_modules/.bin/chromedriver.exe'
        }]
    ],
    framework: 'cucumber',
    reporters: ['spec'],
    cucumberOpts: {
        backtrace: false,
        requireModule: [],
        failAmbiguousDefinitions: false,
        failFast: false,
        ignoreUndefinedDefinitions: false,
        name: [],
        profile: [],
        require: [
            './step-definitions/**/*.js'
        ],
        snippetSyntax: undefined,
        snippets: true,
        source: true,
        strict: false,
        tagsInTitle: false,
        timeout: 60000,
        retry: 0
    },
    
    //
    // =====
    // Hooks
    // =====
    onPrepare: async function (config, capabilities) {
        // Create screenshots directory if it doesn't exist
        const screenshotDir = path.join(process.cwd(), 'screenshots');
        await fs.ensureDir(screenshotDir);
        
        // Launch OpenFin application
        await launchOpenFinApplication();
        
        // Give time for OpenFin to fully initialize
        await new Promise(resolve => setTimeout(resolve, 15000));
    },
    
    beforeFeature: function (uri, feature) {
        // Log which feature is running
        console.log(`Running feature: ${feature.name}`);
    },
    
    afterStep: async function (step, scenario, { error, duration, passed }) {
        // Take screenshot if step fails
        if (error) {
            const screenshotPath = path.join(process.cwd(), 'screenshots', `${step.text.replace(/\s+/g, '_')}_failed.png`);
            await browser.saveScreenshot(screenshotPath);
            console.log(`Screenshot taken: ${screenshotPath}`);
        }
    }
};

// Function to launch OpenFin application
async function launchOpenFinApplication() {
    return new Promise((resolve, reject) => {
        const batFilePath = 'C:\\Merlin\\launch_openfin_fo_dev.bat';
        
        // Check if the batch file exists
        if (!fs.existsSync(batFilePath)) {
            console.error(`Batch file not found: ${batFilePath}`);
            return reject(new Error(`Batch file not found: ${batFilePath}`));
        }
        
        console.log(`Launching OpenFin application using batch file: ${batFilePath}`);
        
        // First kill any existing OpenFin processes
        try {
            spawn('taskkill', ['/f', '/im', 'OpenFin.exe'], { shell: true });
            spawn('taskkill', ['/f', '/im', 'OpenFinRVM.exe'], { shell: true });
            // Give time for process termination
            setTimeout(() => {
                try {
                    // Launch the batch file
                    const child = spawn(batFilePath, { shell: true });
                    
                    child.stdout.on('data', (data) => {
                        console.log(`OpenFin stdout: ${data}`);
                    });
                    
                    child.stderr.on('data', (data) => {
                        console.error(`OpenFin stderr: ${data}`);
                    });
                    
                    child.on('error', (error) => {
                        console.error(`Error launching OpenFin: ${error}`);
                        reject(error);
                    });
                    
                    // We don't wait for the process to exit, as it might run in the background
                    // Instead, resolve after a reasonable delay
                    console.log('OpenFin launch initiated, waiting for initialization...');
                    resolve();
                } catch (error) {
                    console.error(`Error launching batch file: ${error}`);
                    reject(error);
                }
            }, 2000);
        } catch (error) {
            console.error(`Error killing existing processes: ${error}`);
            // Continue with launch anyway
            resolve();
        }
    });
}