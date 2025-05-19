import { switchToWindowContaining } from '../utils/wait-helper.js';

class CommonPage {
    /**
     * Open the menu and click on a menu item
     * @param {string} menuItem - Menu item to click
     * @returns {Promise<boolean>} - True if successful, false otherwise
     */
    async openMenuItem(menuItem) {
        try {
            // Find the hamburger button or menu button
            const menuButton = await $('button.hamburger, .menu-button, [title="Merlin"], [data-testid="merlin-button"]');
            await menuButton.waitForClickable({ timeout: 10000 });
            await menuButton.click();
            
            // Wait for menu to open and click on the menu item
            const menuItemElement = await $(`span=${menuItem}, a=${menuItem}, [title="${menuItem}"]`);
            await menuItemElement.waitForClickable({ timeout: 10000 });
            await menuItemElement.click();
            
            // Wait for the screen to load
            await browser.pause(5000);
            
            return true;
        } catch (error) {
            console.error(`Error opening menu item ${menuItem}: ${error}`);
            return false;
        }
    }

    /**
     * Logout of the application
     * @returns {Promise<boolean>} - True if successful, false otherwise
     */
    async logout() {
        try {
            // Find and click user profile button
            const userProfileButton = await $('[title="User Profile"], .user-profile-button');
            await userProfileButton.waitForClickable({ timeout: 10000 });
            await userProfileButton.click();
            
            // Wait for logout button to appear and click it
            const logoutButton = await $('button=Log Out, button=Logout');
            await logoutButton.waitForClickable({ timeout: 10000 });
            await logoutButton.click();
            
            // Handle confirmation dialog if it appears
            try {
                const confirmButton = await $('button=Confirm, button=Yes');
                await confirmButton.waitForClickable({ timeout: 5000 });
                await confirmButton.click();
            } catch (error) {
                // No confirmation dialog or it has a different structure
                console.log('No confirmation dialog found or it has a different structure');
            }
            
            // Wait for logout to complete
            await browser.pause(5000);
            
            return true;
        } catch (error) {
            console.error(`Error during logout: ${error}`);
            return false;
        }
    }

    /**
     * Switch to window containing text
     * @param {string} text - Text to look for in window title or URL
     * @returns {Promise<boolean>} - True if successful, false otherwise
     */
    async switchToWindow(text) {
        return await switchToWindowContaining(text);
    }
}

export default new CommonPage();
