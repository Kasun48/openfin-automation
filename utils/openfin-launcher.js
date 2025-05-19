const { spawn } = require('child_process');
const fs = require('fs-extra');
const axios = require('axios');

/**
 * Launch OpenFin application using batch file
 * @param {string} batchFilePath - Path to the batch file
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<boolean>} - True if successful, false otherwise
 */
async function launchOpenFinApplication(batchFilePath, timeout = 120000) {
    if (!fs.existsSync(batchFilePath)) {
        console.error(`Batch file not found: ${batchFilePath}`);
        return false;
    }
    
    console.log(`Launching OpenFin application using batch file: ${batchFilePath}`);
    
    // First kill any existing OpenFin processes
    try {
        await killProcess('OpenFin.exe');
        await killProcess('OpenFinRVM.exe');
        // Wait 2 seconds for processes to terminate
        await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
        console.warn(`Error killing existing processes: ${error}`);
    }
    
    // Launch the batch file
    try {
        spawn(batchFilePath, { shell: true });
    } catch (error) {
        console.error(`Error launching batch file: ${error}`);
        return false;
    }
    
    // Wait for debug port to become available
    const startTime = Date.now();
    let debugPortAvailable = false;
    
    console.log('Waiting for debug port to become available...');
    while (Date.now() - startTime < timeout) {
        // Check if debug port is available
        if (await isDebugPortAvailable()) {
            console.log('Debug port is available');
            debugPortAvailable = true;
            break;
        }
        
        // Log progress every 10 seconds
        if ((Date.now() - startTime) % 10000 < 1000) {
            console.log(`Still waiting for debug port... (${Math.floor((Date.now() - startTime) / 1000)}s)`);
        }
        
        // Wait 1 second before checking again
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    if (debugPortAvailable) {
        console.log(`Debug port became available after ${Math.floor((Date.now() - startTime) / 1000)} seconds`);
        // Additional wait for application to fully initialize
        await new Promise(resolve => setTimeout(resolve, 10000));
        return true;
    } else {
        console.error(`Debug port did not become available within ${timeout / 1000} seconds`);
        return false;
    }
}

/**
 * Check if Chrome debug port is available
 * @returns {Promise<boolean>} - True if available, false otherwise
 */
async function isDebugPortAvailable() {
    // Try both IPv4 and IPv6
    try {
        // IPv4 check
        const response = await axios.get('http://127.0.0.1:9222/json', { timeout: 2000 });
        if (response.status === 200) {
            return true;
        }
    } catch (error) {
        // Try IPv6 if IPv4 fails
        try {
            const response = await axios.get('http://[::1]:9222/json', { timeout: 2000 });
            if (response.status === 200) {
                return true;
            }
        } catch (error) {
            return false;
        }
    }
    
    return false;
}

/**
 * Kill process by name
 * @param {string} processName - Name of the process to kill
 * @returns {Promise<void>}
 */
async function killProcess(processName) {
    return new Promise((resolve, reject) => {
        spawn('taskkill', ['/f', '/im', processName], { shell: true })
            .on('close', (code) => {
                if (code === 0) {
                    console.log(`Successfully killed ${processName}`);
                    resolve();
                } else {
                    console.log(`Process ${processName} not found or could not be killed`);
                    resolve(); // Resolve anyway, not finding the process is OK
                }
            })
            .on('error', (error) => {
                console.error(`Error killing ${processName}: ${error}`);
                reject(error);
            });
    });
}

module.exports = {
    launchOpenFinApplication,
    isDebugPortAvailable,
    killProcess
};