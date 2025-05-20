import HistoricalBlotterPage from '../page-objects/historical-blotter.page.js';
import { captureScreenshot } from './screenshot.js';

export async function validateBlotterDataAndScreenshot(filename = 'blotter_data.png') {
    const dataLoaded = await HistoricalBlotterPage.waitForDataLoaded(1, 20000);

    if (!dataLoaded) {
        await captureScreenshot('no_blotter_data.png');
    }

    expect(dataLoaded).toBe(true);

    const rows = await HistoricalBlotterPage.getDataRows();
    console.log(`Found ${rows.length} data rows in the blotter`);

    expect(rows.length).toBeGreaterThan(0);
    await captureScreenshot(filename);
}
