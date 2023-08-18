export async function humanType(element, text, page) {
    for (let i = 0; i < text.length; i++) {
        await element.type(text[i], { delay: (Math.random() * 250 + 100) });
    }
}

export async function humanClick(element, page) {
    await randomDelay(page);
    await element.click();
}

export async function humanRandomMouseMove(page) {
    for (let i = 0; i < Math.floor(Math.random() * 10 + 1); i++) {
        await page.mouse.move(Math.floor(Math.random() * 1000), Math.floor(Math.random() * 1000), { steps: 40, delay: 500 } );
    }
}


export async function randomDelay(page) {
    const min = 2000;
    const max = 5000;
    const delay = Math.floor(Math.random() * (max - min)) + min;
    await page.waitForTimeout(delay);
}