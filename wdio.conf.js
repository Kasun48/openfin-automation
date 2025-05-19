import path from 'path';
import fs from 'fs-extra';
import axios from 'axios';
import { launchOpenFinApplication, isDebugPortAvailable } from './utils/openfin-launcher.js';

const BAT_FILE_PATH = 'C:\\Merlin\\launch_openfin_fo_dev.bat';   // <-- centralised path

export const config = {
    runner: 'local',
    specs: ['./features/**/*.feature'],
    maxInstances: 1,
    automationProtocol: 'devtools',
    capabilities: [{
        browserName: 'chrome',
        'goog:chromeOptions': { debuggerAddress: '127.0.0.1:9222' }
    }],
    services: ['devtools'],
    framework: 'cucumber',
    reporters: ['spec'],
    cucumberOpts: {
        require: ['./step-definitions/**/*.js'],
        timeout: 60_000
    },

    /********** life-cycle hooks **********/
    onPrepare: async () => {
        process.env.CHROMEDRIVER_SKIP_DOWNLOAD = 'true';
        process.env.WDIO_DISABLE_CHROMEDRIVER   = 'true';

        await fs.ensureDir(path.join(process.cwd(), 'screenshots'));

        if (!(await isDebugPortAvailable())) {
            console.log('Debug port not up – launching OpenFin …');
            const ok = await launchOpenFinApplication(BAT_FILE_PATH);
            if (!ok) throw new Error('OpenFin failed to start');
        } else {
            console.log('OpenFin / Chrome debug port is already available.');
        }
    }
};
