import { When, Then } from '@wdio/cucumber-framework';
import HistoricalBlotterPage from '../page-objects/historical-blotter.page.js';
import CommonPage from '../page-objects/common.page.js';
import { captureScreenshot } from '../utils/screenshot.js';
import { switchToWindowContaining } from '../utils/wait-helper.js';
import { validateBlotterDataAndScreenshot } from '../utils/blotter-helpers.js';

When('I navigate to the Historical Trader Blotter screen', async () => {
    console.log('Navigating to Historical Trader Blotter screen...');

    const opened = await CommonPage.openMenuItem('Historical Trader Blotter');

    if (!opened) {
        await switchToWindowContaining('Historical');
    }

    await browser.pause(5000);
    await captureScreenshot('historical_blotter_navigation.png');
});

Then('the Historical Trader Blotter screen should be displayed', async () => {
    const isLoaded = await HistoricalBlotterPage.isLoaded();

    if (!isLoaded) {
        await captureScreenshot('historical_blotter_not_loaded.png');
    }

    expect(isLoaded).toBe(true);
});

When('I click the {string} ownership button', async (ownership) => {
    console.log(`Clicking ${ownership} ownership button`);
    let clicked = false;

    switch (ownership.toLowerCase()) {
        case 'all':
            clicked = await HistoricalBlotterPage.clickAllOwnershipButton();
            break;
        case 'mine':
            clicked = await HistoricalBlotterPage.clickMineOwnershipButton();
            break;
        case 'team':
            clicked = await HistoricalBlotterPage.clickTeamOwnershipButton();
            break;
        default:
            throw new Error(`Unknown ownership button: ${ownership}`);
    }

    if (!clicked) {
        await captureScreenshot(`${ownership}_ownership_click_failed.png`);
    }

    expect(clicked).toBe(true);
});

When('I click the {string} desk button', async (desk) => {
    console.log(`Clicking ${desk} desk button`);
    let clicked = false;

    if (desk === 'CORP') {
        clicked = await HistoricalBlotterPage.clickCorpDeskButton();
    } else {
        throw new Error(`Desk button not implemented: ${desk}`);
    }

    if (!clicked) {
        await captureScreenshot(`${desk}_desk_click_failed.png`);
    }

    expect(clicked).toBe(true);
});

When('I click the {string} status button', async (status) => {
    console.log(`Clicking ${status} status button`);
    let clicked = false;

    switch (status.toLowerCase()) {
        case 'all':
            clicked = await HistoricalBlotterPage.clickAllStatusButton();
            break;
        case 'done':
            clicked = await HistoricalBlotterPage.clickDoneStatusButton();
            break;
        case 'covered':
            clicked = await HistoricalBlotterPage.clickCoveredStatusButton();
            break;
        default:
            throw new Error(`Unknown status button: ${status}`);
    }

    if (!clicked) {
        await captureScreenshot(`${status}_status_click_failed.png`);
    }

    expect(clicked).toBe(true);
});

When('I click the {string} currency button', async (currency) => {
    console.log(`Clicking ${currency} currency button`);
    let clicked = false;

    switch (currency) {
        case 'USD':
            clicked = await HistoricalBlotterPage.clickUsdCurrencyButton();
            break;
        case 'EUR':
            clicked = await HistoricalBlotterPage.clickEurCurrencyButton();
            break;
        case 'GBP':
            clicked = await HistoricalBlotterPage.clickGbpCurrencyButton();
            break;
        default:
            throw new Error(`Unknown currency button: ${currency}`);
    }

    if (!clicked) {
        await captureScreenshot(`${currency}_currency_click_failed.png`);
    }

    expect(clicked).toBe(true);
});

When('I sort by the {string} column', async (column) => {
    console.log(`Sorting by ${column} column`);
    let clicked = false;

    if (column === 'created_time') {
        clicked = await HistoricalBlotterPage.clickCreatedTimeHeader();
    } else {
        throw new Error(`Column sorting not implemented: ${column}`);
    }

    if (!clicked) {
        await captureScreenshot(`${column}_sort_failed.png`);
    }

    expect(clicked).toBe(true);
});

When('I filter the side column with {string}', async (value) => {
    console.log(`Filtering side column with ${value}`);
    const filtered = await HistoricalBlotterPage.filterSideColumn(value);

    if (!filtered) {
        await captureScreenshot(`side_filter_${value}_failed.png`);
    }

    expect(filtered).toBe(true);
});

Then('I should see blotter data', async () => {
    await validateBlotterDataAndScreenshot();
});

Then('I should see blotter data showing all ownership', async () => {
    await validateBlotterDataAndScreenshot('all_ownership_data.png');
});

Then('I should see blotter data showing only CORP desk trades', async () => {
    await validateBlotterDataAndScreenshot('corp_desk_data.png');
});

Then('I should see blotter data showing only Covered status trades', async () => {
    await validateBlotterDataAndScreenshot('covered_status_data.png');
});

Then('I should see blotter data showing only USD currency trades', async () => {
    await validateBlotterDataAndScreenshot('usd_currency_data.png');
});

Then('I should see blotter data sorted by creation time', async () => {
    await validateBlotterDataAndScreenshot('sorted_data.png');
});

Then('all rows should have {string} in the side column', async (value) => {
    const verified = await HistoricalBlotterPage.verifyColumnValues(
        'side',
        null,
        (cellValue) => cellValue.toUpperCase().includes(value.toUpperCase())
    );

    if (!verified) {
        await captureScreenshot(`side_column_verification_failed_${value}.png`);
    }

    expect(verified).toBe(true);
});
