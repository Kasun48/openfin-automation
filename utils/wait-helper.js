export async function waitForVisible(element, timeout = 10000) {
    await element.waitForDisplayed({ timeout });
}

export async function waitForClickable(element, timeout = 10000) {
    await element.waitForClickable({ timeout });
}

export async function waitForFrameAndSwitch(selector, timeout = 10000) {
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

export async function switchToWindowContaining(text, timeout = 10000) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
        const handles = await browser.getWindowHandles();
        for (const handle of handles) {
            await browser.switchToWindow(handle);
            const title = await browser.getTitle();
            const url = await browser.getUrl();
            if (title.toLowerCase().includes(text.toLowerCase()) ||
                url.toLowerCase().includes(text.toLowerCase())) {
                console.log(`Found window containing '${text}': ${title}`);
                return true;
            }
        }
        await browser.pause(500);
    }
    console.error(`Window containing '${text}' not found after ${timeout}ms`);
    return false;
}

export async function findElementInFrames(elementSelector, maxDepth = 3) {
    if (await $(elementSelector).isExisting()) return true;
    await browser.switchToFrame(null);

    async function searchFrames(depth = 0) {
        if (depth > maxDepth) return false;
        const frames = await $$('iframe');
        for (const frame of frames) {
            try {
                await browser.switchToFrame(frame);
                if (await $(elementSelector).isExisting()) return true;
                if (await searchFrames(depth + 1)) return true;
                await browser.switchToParentFrame();
            } catch {
                await browser.switchToFrame(null);
            }
        }
        return false;
    }

    return await searchFrames();
}
