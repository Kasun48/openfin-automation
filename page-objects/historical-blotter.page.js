import { Given, When, Then } from '@wdio/cucumber-framework';
import HistoricalBlotterPage from '../page-objects/historical-blotter.page.js';
import CommonPage from '../page-objects/common.page.js';
import { captureScreenshot } from '../utils/screenshot.js';
import { switchToWindowContaining } from '../utils/wait-helper.js';


class HistoricalBlotterPage {
    // Selectors
    get allOwnershipButton() { return $('#all-ownership-button, [data-testid="all-ownership-button"]'); }
    get mineOwnershipButton() { return $('#mine-ownership-button, [data-testid="mine-ownership-button"]'); }
    get teamOwnershipButton() { return $('#team-ownership-button, [data-testid="team-ownership-button"]'); }
    
    get corpDeskButton() { return $('#CORP-traderDesk-button, [data-testid="CORP-traderDesk-button"]'); }
    
    get allStatusButton() { return $('#all-status-button, [data-testid="all-status-button"]'); }
    get doneStatusButton() { return $('#done-status-button, [data-testid="done-status-button"]'); }
    get coveredStatusButton() { return $('#covered-status-button, [data-testid="covered-status-button"]'); }
    
    get eurCurrencyButton() { return $('#EUR-currency-button, [data-testid="EUR-currency-button"]'); }
    get gbpCurrencyButton() { return $('#GBP-currency-button, [data-testid="GBP-currency-button"]'); }
    get usdCurrencyButton() { return $('#USD-currency-button, [data-testid="USD-currency-button"]'); }
    
    get createdTimeHeader() { return $('div[role="columnheader"][col-id="created_time"]'); }
    get sideFilterInput() { return $('input[aria-label="B/S Filter Input"]'); }
    get dataRows() { return $$('div[role="row"][aria-rowindex]'); }

    /**
     * Check if the Historical Blotter is loaded
     * @returns {Promise<boolean>} - True if loaded, false otherwise
     */
    async isLoaded() {
        try {
            // First try to find and switch to the frame containing the Historical Blotter
            await this.switchToHistoricalBlotterFrame();
            
            // Check if key elements exist
            return await this.allOwnershipButton.isExisting();
        } catch (error) {
            console.error(`Error checking if Historical Blotter is loaded: ${error}`);
            return false;
        }
    }

    /**
     * Switch to the frame containing the Historical Blotter
     * @returns {Promise<boolean>} - True if successful, false otherwise
     */
    async switchToHistoricalBlotterFrame() {
        try {
            // First try direct approach - Historical Blotter might be in main content
            if (await $('#HistoricalBlotter, [data-testid="HistoricalBlotter"]').isExisting()) {
                return true;
            }
            
            // Try to find the element in frames
            return await findElementInFrames('#HistoricalBlotter, [data-testid="HistoricalBlotter"]');
        } catch (error) {
            console.error(`Error switching to Historical Blotter frame: ${error}`);
            return false;
        }
    }

    /**
     * Click the "All" ownership button
     * @returns {Promise<boolean>} - True if successful, false otherwise
     */
    async clickAllOwnershipButton() {
        try {
            await this.switchToHistoricalBlotterFrame();
            await waitForClickable(this.allOwnershipButton);
            await this.allOwnershipButton.click();
            return true;
        } catch (error) {
            console.error(`Error clicking All ownership button: ${error}`);
            return false;
        }
    }

    /**
     * Click the "Mine" ownership button
     * @returns {Promise<boolean>} - True if successful, false otherwise
     */
    async clickMineOwnershipButton() {
        try {
            await this.switchToHistoricalBlotterFrame();
            await waitForClickable(this.mineOwnershipButton);
            await this.mineOwnershipButton.click();
            return true;
        } catch (error) {
            console.error(`Error clicking Mine ownership button: ${error}`);
            return false;
        }
    }

    /**
     * Click the "Team" ownership button
     * @returns {Promise<boolean>} - True if successful, false otherwise
     */
    async clickTeamOwnershipButton() {
        try {
            await this.switchToHistoricalBlotterFrame();
            await waitForClickable(this.teamOwnershipButton);
            await this.teamOwnershipButton.click();
            return true;
        } catch (error) {
            console.error(`Error clicking Team ownership button: ${error}`);
            return false;
        }
    }

    /**
     * Click the "CORP" desk button
     * @returns {Promise<boolean>} - True if successful, false otherwise
     */
    async clickCorpDeskButton() {
        try {
            await this.switchToHistoricalBlotterFrame();
            await waitForClickable(this.corpDeskButton);
            await this.corpDeskButton.click();
            return true;
        } catch (error) {
            console.error(`Error clicking CORP desk button: ${error}`);
            return false;
        }
    }

    /**
     * Click the "All" status button
     * @returns {Promise<boolean>} - True if successful, false otherwise
     */
    async clickAllStatusButton() {
        try {
            await this.switchToHistoricalBlotterFrame();
            await waitForClickable(this.allStatusButton);
            await this.allStatusButton.click();
            return true;
        } catch (error) {
            console.error(`Error clicking All status button: ${error}`);
            return false;
        }
    }

    /**
     * Click the "Done" status button
     * @returns {Promise<boolean>} - True if successful, false otherwise
     */
    async clickDoneStatusButton() {
        try {
            await this.switchToHistoricalBlotterFrame();
            await waitForClickable(this.doneStatusButton);
            await this.doneStatusButton.click();
            return true;
        } catch (error) {
            console.error(`Error clicking Done status button: ${error}`);
            return false;
        }
    }

    /**
     * Click the "Covered" status button
     * @returns {Promise<boolean>} - True if successful, false otherwise
     */
    async clickCoveredStatusButton() {
        try {
            await this.switchToHistoricalBlotterFrame();
            await waitForClickable(this.coveredStatusButton);
            await this.coveredStatusButton.click();
            return true;
        } catch (error) {
            console.error(`Error clicking Covered status button: ${error}`);
            return false;
        }
    }

    /**
     * Click the "EUR" currency button
     * @returns {Promise<boolean>} - True if successful, false otherwise
     */
    async clickEurCurrencyButton() {
        try {
            await this.switchToHistoricalBlotterFrame();
            await waitForClickable(this.eurCurrencyButton);
            await this.eurCurrencyButton.click();
            return true;
        } catch (error) {
            console.error(`Error clicking EUR currency button: ${error}`);
            return false;
        }
    }

    /**
     * Click the "GBP" currency button
     * @returns {Promise<boolean>} - True if successful, false otherwise
     */
    async clickGbpCurrencyButton() {
        try {
            await this.switchToHistoricalBlotterFrame();
            await waitForClickable(this.gbpCurrencyButton);
            await this.gbpCurrencyButton.click();
            return true;
        } catch (error) {
            console.error(`Error clicking GBP currency button: ${error}`);
            return false;
        }
    }

    /**
     * Click the "USD" currency button
     * @returns {Promise<boolean>} - True if successful, false otherwise
     */
    async clickUsdCurrencyButton() {
        try {
            await this.switchToHistoricalBlotterFrame();
            await waitForClickable(this.usdCurrencyButton);
            await this.usdCurrencyButton.click();
            return true;
        } catch (error) {
            console.error(`Error clicking USD currency button: ${error}`);
            return false;
        }
    }

    /**
     * Click the "created_time" column header to sort
     * @returns {Promise<boolean>} - True if successful, false otherwise
     */
    async clickCreatedTimeHeader() {
        try {
            await this.switchToHistoricalBlotterFrame();
            await waitForClickable(this.createdTimeHeader);
            await this.createdTimeHeader.click();
            return true;
        } catch (error) {
            console.error(`Error clicking created_time header: ${error}`);
            return false;
        }
    }

    /**
     * Filter side column with value
     * @param {string} value - Value to filter by
     * @returns {Promise<boolean>} - True if successful, false otherwise
     */
    async filterSideColumn(value) {
        try {
            await this.switchToHistoricalBlotterFrame();
            await waitForVisible(this.sideFilterInput);
            await this.sideFilterInput.setValue(value);
            await browser.keys('Enter');
            return true;
        } catch (error) {
            console.error(`Error filtering side column: ${error}`);
            return false;
        }
    }

    /**
     * Wait for data to load
     * @param {number} minRows - Minimum number of rows to wait for
     * @param {number} timeout - Timeout in milliseconds
     * @returns {Promise<boolean>} - True if data loaded, false otherwise
     */
    async waitForDataLoaded(minRows = 1, timeout = 15000) {
        try {
            const startTime = Date.now();
            
            while (Date.now() - startTime < timeout) {
                // Make sure we're in the right frame
                await this.switchToHistoricalBlotterFrame();
                
                // Get all data rows
                const rows = await this.getDataRows();
                
                if (rows.length >= minRows) {
                    console.log(`Data loaded with ${rows.length} rows`);
                    return true;
                }
                
                // Wait a bit before checking again
                await browser.pause(500);
            }
            
            console.warn(`Timeout waiting for data to load (min ${minRows} rows)`);
            return false;
        } catch (error) {
            console.error(`Error waiting for data to load: ${error}`);
            return false;
        }
    }

    /**
     * Get all data rows
     * @param {boolean} skipHeader - Whether to skip header row
     * @param {boolean} skipFilter - Whether to skip filter row
     * @returns {Promise<WebdriverIO.Element[]>} - Array of row elements
     */
    async getDataRows(skipHeader = true, skipFilter = true) {
        try {
            await this.switchToHistoricalBlotterFrame();
            
            // Wait for at least one row to be present
            await browser.waitUntil(
                async () => (await this.dataRows).length > 0,
                { timeout: 15000, timeoutMsg: 'No data rows found' }
            );
            
            // Get all rows
            const rows = await this.dataRows;
            
            // Skip header and filter rows if requested
            let startIndex = 0;
            if (skipHeader) {
                startIndex += 1;
            }
            if (skipFilter) {
                startIndex += 1;
            }
            
            return rows.slice(startIndex);
        } catch (error) {
            console.error(`Error getting data rows: ${error}`);
            return [];
        }
    }

    /**
     * Verify values in a specific column
     * @param {string} columnId - Column ID
     * @param {string} expectedValue - Expected value
     * @param {Function} condition - Condition function
     * @returns {Promise<boolean>} - True if all values match the condition
     */
    async verifyColumnValues(columnId, expectedValue = null, condition = null) {
        try {
            await this.switchToHistoricalBlotterFrame();
            
            // First find the column header to get its index
            const header = await $(`div[role='columnheader'][col-id='${columnId}']`);
            const colIndex = await header.getAttribute('aria-colindex');
            
            // Get all data rows
            const rows = await this.getDataRows();
            
            if (rows.length === 0) {
                console.warn('No data rows found to verify');
                return false;
            }
            
            // Check each row's cell in this column
            for (const row of rows) {
                const cell = await row.$(`div[aria-colindex='${colIndex}']`);
                const value = await cell.getText();
                
                // Verify the value
                if (expectedValue !== null && value !== expectedValue) {
                    console.warn(`Column ${columnId} has value '${value}', expected '${expectedValue}'`);
                    return false;
                }
                
                if (condition !== null && !condition(value)) {
                    console.warn(`Column ${columnId} value '${value}' failed condition check`);
                    return false;
                }
            }
            
            console.log(`All values in column ${columnId} passed verification`);
            return true;
        } catch (error) {
            console.error(`Error verifying column values: ${error}`);
            return false;
        }
    }
}

module.exports = new HistoricalBlotterPage();