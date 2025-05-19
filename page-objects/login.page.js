import { waitForVisible, waitForClickable } from '../utils/wait-helper.js';

class LoginPage {
    // Selectors
    get usernameInput() { return $('input[type="text"]'); }
    get passwordInput() { return $('input[type="password"]'); }
    get loginButton() { return $('button=Login'); }
    get errorMessage() { return $('.error-message'); }

    /**
     * Login with credentials
     * @param {string} username - Username
     * @param {string} password - Password
     * @returns {Promise<void>}
     */
    async login(username, password) {
        console.log(`Logging in with username: ${username}`);
        await waitForVisible(this.usernameInput);
        await this.usernameInput.setValue(username);
        
        await waitForVisible(this.passwordInput);
        await this.passwordInput.setValue(password);
        
        await waitForClickable(this.loginButton);
        await this.loginButton.click();
    }

    /**
     * Check if logged in successfully by looking for the Dock element
     * @returns {Promise<boolean>} - True if logged in, false otherwise
     */
    async isLoggedIn() {
        try {
            // Wait for the Dock element to appear
            const dockElement = await $('[title="Dock"], #dock, .dock');
            return await dockElement.waitForExist({ timeout: 30000 });
        } catch (error) {
            console.error(`Error checking if logged in: ${error}`);
            return false;
        }
    }

    /**
     * Get error message text
     * @returns {Promise<string>} - Error message text
     */
    async getErrorMessage() {
        try {
            await waitForVisible(this.errorMessage);
            return await this.errorMessage.getText();
        } catch (error) {
            // If there's no specific error message element, try to find any element with error related text
            const possibleErrors = await $$('*=error, *=failed, *=incorrect, *=invalid');
            for (const element of possibleErrors) {
                if (await element.isDisplayed()) {
                    return await element.getText();
                }
            }
            return '';
        }
    }
}

export default new LoginPage();
