import { Page, Locator, ElementHandle } from "puppeteer";

export async function type(element : Locator<HTMLInputElement>, text : string, page : Page) {

    await element.click();

    console.log(text)

    for (let i = 0; i < text.length; i++) {
        await page.keyboard.type(text[i], { delay: (Math.random() * 250 + 100) });
    }
}

export async function click(element : any) {
    await delay();
    await element.click();
    await delay()
}


export async function mmouse(page : Page) {
    for (let i = 0; i < Math.floor(Math.random() * 10 + 1); i++) {
        await page.mouse.move(Math.floor(Math.random() * 1000), Math.floor(Math.random() * 1000), { steps: 40 });
    }
}

export async function delay() {
    const min = 2000;
    const max = 5000;
    const delay = Math.floor(Math.random() * (max - min)) + min;
    await new Promise(resolve => setTimeout(resolve, delay));
}
