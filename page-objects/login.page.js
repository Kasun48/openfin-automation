import { waitForVisible, waitForClickable } from '../utils/wait-helper.js';

class LoginPage {
    // === Selectors ===
    get usernameInput() { return $('input[type="text"]'); }
    get passwordInput() { return $('input[type="password"]'); }
    get loginButton()   { return $('button=Login'); }
    get errorMessage()  { return $('.error-message'); }

    /**
     * Login with provided credentials
     * @param {string} username
     * @param {string} password
     */
    async login(username, password) {
        console.log(`[LoginPage] Attempting login as: ${username}`);
        
        await waitForVisible(this.usernameInput);
        await this.usernameInput.setValue(username);

        await waitForVisible(this.passwordInput);
        await this.passwordInput.setValue(password);

        await waitForClickable(this.loginButton);
        await this.loginButton.click();
    }

    /**
     * Check if login succeeded by validating presence of Dock or dashboard
     * @returns {Promise<boolean>}
     */
    async isLoggedIn() {
        try {
            const dockElement = await $('[title="Dock"], #dock, .dock');
            return await dockElement.waitForExist({ timeout: 30000 });
        } catch (error) {
            console.error(`[LoginPage] Login check failed: ${error}`);
            return false;
        }
    }

    /**
     * Retrieve login error message (fallbacks included)
     * @returns {Promise<string>}
     */
    async getErrorMessage() {
        try {
            await waitForVisible(this.errorMessage);
            return await this.errorMessage.getText();
        } catch {
            // fallback to scan DOM for generic error messages
            const fallbackElements = await $$('*=error, *=invalid, *=failed, *=incorrect');
            for (const el of fallbackElements) {
                if (await el.isDisplayed()) {
                    return await el.getText();
                }
            }
            return '';
        }
    }
}

export default new LoginPage();
