import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import dotenv from 'dotenv';

import { login, getVillagesInfo } from './core.js'

// Register the Stealth plugin
puppeteer.use(StealthPlugin());

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
    });

    const page = await browser.newPage();

    dotenv.config();
    const username = process.env.TRAVIAN_USERNAME;
    const password = process.env.TRAVIAN_PASSWORD;

    await login(page, username, password);

    await getVillagesInfo(page);

    await new Promise(resolve => setTimeout(resolve, 10000));

    // Close the browser
    await browser.close();
})();
