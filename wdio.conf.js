const path = require('path');
const fs = require('fs-extra');
const { spawn } = require('child_process');
const axios = require('axios');

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
    exclude: [],
    //
    // ============
    // Capabilities
    // ============
    maxInstances: 1,
    capabilities: [{
        browserName: 'chrome',
        acceptInsecureCerts: true,
        'goog:chromeOptions': {
            debuggerAddress: '127.0.0.1:9222'
        },
        // Force DevTools protocol and disable WebDriver protocol
        automationProtocol: 'devtools'
    }],
    //
    // ===================
    // Test Configurations
    // ===================
    logLevel: 'info',
    bail: 0,
    baseUrl: 'http://localhost:8081',
    waitforTimeout: 60000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    
    // No services needed with DevTools protocol
    services: [],
    
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
        
        // Check if debug port is already available
        let debugPortAvailable = false;
        try {
            const response = await axios.get('http://127.0.0.1:9222/json', { timeout: 2000 })
                .catch(() => axios.get('http://[::1]:9222/json', { timeout: 2000 }));
                
            if (response && response.status === 200) {
                console.log('Debug port 9222 is already available, no need to launch OpenFin');
                debugPortAvailable = true;
            }
        } catch (e) {
            console.log('Debug port not available, will launch OpenFin application');
        }
        
        // Only launch OpenFin if debug port is not available
        if (!debugPortAvailable) {
            await launchOpenFinApplication();
            
            // Give time for OpenFin to fully initialize
            await new Promise(resolve => setTimeout(resolve, 15000));
        }
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

// Helper function to check if debug port is available
async function isDebugPortAvailable() {
    try {
        // Try both IPv4 and IPv6
        const response = await axios.get('http://127.0.0.1:9222/json', { timeout: 2000 })
            .catch(() => axios.get('http://[::1]:9222/json', { timeout: 2000 }));
            
        return response && response.status === 200;
    } catch (e) {
        return false;
    }
}