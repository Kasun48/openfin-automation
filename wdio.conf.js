import path from 'path';
import fs from 'fs-extra';
import axios from 'axios';
import { launchOpenFinApplication, isDebugPortAvailable } from './utils/openfin-launcher.js';

const BAT_FILE_PATH = 'C:\\Merlin\\launch_openfin_fo_dev.bat';   // <-- path of the BAT File

export const config = {
    runner: 'local',
    specs: ['./features/**/*.feature'],
    maxInstances: 1,
    automationProtocol: 'devtools',
    capabilities: [{
        browserName: 'chrome',
        'goog:chromeOptions': {
            debuggerAddress: 'localhost:9222', // OpenFin's debug port
            args: [
                '--remote-debugging-port=9222'
            ]
        }
    }],
    // ===================
    // Test Configurations
    // ===================
    logLevel: 'info',
    bail: 0,
    baseUrl: 'http://localhost',
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    services: ['devtools'],
    framework: 'cucumber',
    reporters: ['spec'],
    
    // Cucumber configurations
    cucumberOpts: {
        require: ['./step-definitions/**/*.js'],
        backtrace: false,
        requireModule: [],
        dryRun: false,
        failFast: false,
        snippets: true,
        source: true,
        strict: false,
        tagExpression: '',
        timeout: 60000,
        ignoreUndefinedDefinitions: false
    },

    /********** life-cycle hooks **********/
    onPrepare: async function (config, capabilities) {

	process.env.CHROMEDRIVER_SKIP_DOWNLOAD = 'true';
        process.env.WDIO_DISABLE_CHROMEDRIVER   = 'true';

        // Import the function dynamically to avoid top-level await issues
        const { launchOpenFinApplication } = await import('./utils/openfin-launcher.js');
        
        // Launch OpenFin application before the test
        console.log('Launching OpenFin application...');
        try {
            await launchOpenFinApplication(BAT_FILE_PATH);
            console.log('OpenFin application launched successfully');
        } catch (error) {
            console.error('Failed to launch OpenFin application:', error);
        }
    },
    
    onComplete: async function(exitCode, config, capabilities, results) {
        console.log('Test run completed with exit code:', exitCode);
    }
};
