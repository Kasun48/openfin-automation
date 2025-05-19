const { Given, When, Then } = require('@wdio/cucumber-framework');
const LoginPage = require('../page-objects/login.page');
const CommonPage = require('../page-objects/common.page');
const { captureScreenshot } = require('../utils/screenshot');

Given('the OpenFin application is launched', async () => {
    // The application is launched in the onPrepare hook, so we just need to verify it's running
    await browser.pause(2000); // Short wait to ensure UI is stable
    
    // Check if we are already on the Mizuho login screen
    const title = await browser.getTitle();
    if (title.includes('Mizuho') || title.includes('Login')) {
        console.log(`Found login screen with title: ${title}`);
    } else {
        // Try to find the login window
        const loginElements = await $$('input[type="text"], input[type="password"]');
        if (loginElements.length >= 2) {
            console.log('Found login form with username and password fields');
        } else {
            console.warn('Could not verify login screen, but continuing anyway');
            await captureScreenshot('login_screen_verification.png');
        }
    }
});

When('I enter valid credentials', async () => {
    await LoginPage.login('ranaka', 'NewLoginPass123');
});

When('I enter invalid credentials', async () => {
    await LoginPage.login('invalid_user', 'wrong_password');
});

Then('I should be logged in successfully', async () => {
    const loggedIn = await LoginPage.isLoggedIn();
    
    if (!loggedIn) {
        await captureScreenshot('login_failed.png');
    }
    
    expect(loggedIn).toBe(true);
});

Then('I should see an error message', async () => {
    const errorMessage = await LoginPage.getErrorMessage();
    await captureScreenshot('error_message.png');
    
    // Check if there is any error message
    expect(errorMessage.length).toBeGreaterThan(0);
    
    // Optionally, check for specific error message content
    expect(errorMessage.toLowerCase()).toContain('fail');
});

When('I log out', async () => {
    const logoutSuccessful = await CommonPage.logout();
    
    if (!logoutSuccessful) {
        await captureScreenshot('logout_failed.png');
    }
    
    expect(logoutSuccessful).toBe(true);
});

Then('I should be logged out successfully', async () => {
    // After logout, we should be back at the login screen
    const title = await browser.getTitle();
    
    // Take a screenshot for verification
    await captureScreenshot('after_logout.png');
    
    // Either the title contains 'login' or 'mizuho', or we can see login fields
    let loggedOut = title.toLowerCase().includes('login') || title.toLowerCase().includes('mizuho');
    
    if (!loggedOut) {
        // Check for login fields as an alternative verification
        const loginFields = await $$('input[type="text"], input[type="password"]');
        loggedOut = loginFields.length >= 2;
    }
    
    expect(loggedOut).toBe(true);
});