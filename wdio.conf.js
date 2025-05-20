import path from 'path';
import fs from 'fs-extra';
import { spawn } from 'child_process';

// Define OpenFin bat file path
const BAT_FILE_PATH = 'C:\\Merlin\\launch_openfin_fo_dev.bat';

// Helper functions
async function isDebugPortAvailable() {
    try {
        const response = await fetch('http://127.0.0.1:9222/json', { signal: AbortSignal.timeout(2000) });
        return response.ok;
    } catch {
        try {
            const response = await fetch('http://[::1]:9222/json', { signal: AbortSignal.timeout(2000) });
            return response.ok;
        } catch {
            return false;
        }
    }
}

async function killProcess(processName) {
    return new Promise((resolve, reject) => {
        spawn('taskkill', ['/f', '/im', processName], { shell: true })
            .on('close', code => resolve())
            .on('error', reject);
    });
}

async function launchOpenFinApp(batchFilePath, timeout = 120000) {
    if (!await fs.pathExists(batchFilePath)) {
        console.error(`Batch file not found: ${batchFilePath}`);
        return false;
    }

    console.log(`Launching OpenFin application using batch file: ${batchFilePath}`);
    
    try {
        await killProcess('OpenFin.exe');
        await killProcess('OpenFinRVM.exe');
        await new Promise(resolve => setTimeout(resolve, 12000));
    } catch (error) {
        console.warn(`Error killing existing processes: ${error}`);
    }

    try {
        spawn(batchFilePath, { shell: true });
    } catch (error) {
        console.error(`Error launching batch file: ${error}`);
        return false;
    }

    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
        if (await isDebugPortAvailable()) {
            console.log('Debug port is available');
            await new Promise(resolve => setTimeout(resolve, 10000));
            return true;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.error(`Debug port did not become available within ${timeout / 1000} seconds`);
    return false;
}

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
        // Set environment variables
        process.env.CHROMEDRIVER_SKIP_DOWNLOAD = 'true';
        process.env.WDIO_DISABLE_CHROMEDRIVER = 'true';
        
        // Launch OpenFin application before the test
        console.log('Launching OpenFin application...');
        try {
            await launchOpenFinApp(BAT_FILE_PATH);
            console.log('OpenFin application launched successfully');
        } catch (error) {
            console.error('Failed to launch OpenFin application:', error);
        }
    },
    
    onComplete: async function(exitCode, config, capabilities, results) {
        console.log('Test run completed with exit code:', exitCode);
    }
};