import fs from 'fs-extra';
import path from 'path';

/**
 * Capture a screenshot
 * @param {string} filename - Name of the screenshot file
 * @returns {Promise<string>} - Path to the saved screenshot
 */
export async function captureScreenshot(filename) {
    const screenshotDir = path.join(process.cwd(), 'screenshots');
    await fs.ensureDir(screenshotDir);

    const filePath = path.join(screenshotDir, filename);
    await browser.saveScreenshot(filePath);

    console.log(`Screenshot saved to: ${filePath}`);
    return filePath;
}
