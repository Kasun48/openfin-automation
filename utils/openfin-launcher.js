import { spawn } from 'child_process';
import fs from 'fs-extra';
import axios from 'axios';

/**
 * Launch OpenFin application using batch file
 */
export async function launchOpenFinApplication(batchFilePath, timeout = 120000) {
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

export async function isDebugPortAvailable() {
    try {
        const response = await axios.get('http://127.0.0.1:9222/json', { timeout: 2000 });
        return response.status === 200;
    } catch {
        try {
            const response = await axios.get('http://[::1]:9222/json', { timeout: 2000 });
            return response.status === 200;
        } catch {
            return false;
        }
    }
}

export async function killProcess(processName) {
    return new Promise((resolve, reject) => {
        spawn('taskkill', ['/f', '/im', processName], { shell: true })
            .on('close', code => code === 0 ? resolve() : resolve())
            .on('error', reject);
    });
}