/**
 * Wait helper functions
 */

/**
 * Wait for element to be visible
 * @param {WebdriverIO.Element} element - Element to wait for
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<void>}
 */
async function waitForVisible(element, timeout = 10000) {
    await element.waitForDisplayed({ timeout });
}

/**
 * Wait for element to be clickable
 * @param {WebdriverIO.Element} element - Element to wait for
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<void>}
 */
async function waitForClickable(element, timeout = 10000) {
    await element.waitForClickable({ timeout });
}

/**
 * Wait for frame and switch to it
 * @param {string} selector - Selector for the frame
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<boolean>} - True if frame was found and switched to
 */
async function waitForFrameAndSwitch(selector, timeout = 10000) {
    try {
        const frame = await $(selector);
        await frame.waitForExist({ timeout });
        await browser.switchToFrame(frame);
        return true;
    } catch (error) {
        console.error(`Error switching to frame: ${error}`);
        return false;
    }
}

/**
 * Switch to window containing text
 * @param {string} text - Text to look for in the window title or URL
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<boolean>} - True if window was found and switched to
 */
async function switchToWindowContaining(text, timeout = 10000) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
        const handles = await browser.getWindowHandles();
        
        for (const handle of handles) {
            await browser.switchToWindow(handle);
            
            // Check both title and URL
            const title = await browser.getTitle();
            const url = await browser.getUrl();
            
            if (title.toLowerCase().includes(text.toLowerCase()) || 
                url.toLowerCase().includes(text.toLowerCase())) {
                console.log(`Found window containing '${text}': ${title}`);
                return true;
            }
        }
        
        // Wait a bit before trying again
        await browser.pause(500);
    }
    
    console.error(`Window containing '${text}' not found after ${timeout}ms`);
    return false;
}

/**
 * Find and switch to frame containing an element
 * @param {string} elementSelector - Selector for the element to find in frames
 * @param {number} maxDepth - Maximum depth to search in nested frames
 * @returns {Promise<boolean>} - True if element was found in a frame
 */
async function findElementInFrames(elementSelector, maxDepth = 3) {
    // Try in main document first
    if (await $(elementSelector).isExisting()) {
        return true;
    }
    
    // Switch to default content to start search
    await browser.switchToFrame(null);
    
    // Function to recursively search frames
    async function searchFrames(depth = 0) {
        if (depth > maxDepth) return false;
        
        // Get all frames in current context
        const frames = await $$('iframe');
        
        for (const frame of frames) {
            try {
                // Switch to this frame
                await browser.switchToFrame(frame);
                
                // Check if element exists in this frame
                if (await $(elementSelector).isExisting()) {
                    return true;
                }
                
                // Recursively check nested frames
                if (await searchFrames(depth + 1)) {
                    return true;
                }
                
                // Go back to parent if not found in this frame's subtree
                await browser.switchToParentFrame();
            } catch (error) {
                console.warn(`Error checking frame: ${error}`);
                await browser.switchToFrame(null); // Switch back to default content on error
            }
        }
        
        return false;
    }
    
    return await searchFrames();
}

module.exports = {
    waitForVisible,
    waitForClickable,
    waitForFrameAndSwitch,
    switchToWindowContaining,
    findElementInFrames
};