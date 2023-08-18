import { chromium } from 'playwright';
import dotenv from 'dotenv';
import { login, getVillagesInfo } from './core.js';


(async () => {


    const browser = await chromium.launch({
        headless: false,
    });

    const context = await browser.newContext();
    const page = await context.newPage();


    dotenv.config();
    const username = process.env.TRAVIAN_USERNAME;
    const password = process.env.TRAVIAN_PASSWORD;
    
    await login(page, username, password);

    await getVillagesInfo(page);

    await page.waitForTimeout(10000);



    // Close the browser
    await browser.close();
})();
