import {
    get_villages,
    get_village_resource,
    get_village_buildings,
    check_village_building_queue,
} from './utils.js' //utils functions

import * as human from './human.js'; //human behavior

import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

import dotenv from 'dotenv'; //env variables
import winston from 'winston'; //logger

puppeteer.use(StealthPlugin()); //stealth plugin to avoid detection

export async function init_bot() {

    const browser = await puppeteer.launch({
        headless: false,
    });

    const page = await browser.newPage();


    dotenv.config();
    const username = process.env.TRAVIAN_USERNAME;
    const password = process.env.TRAVIAN_PASSWORD;

    const bot = {
        browser: browser,
        page: page,
        username: username,
        password: password,
    }
    
    return bot;
}

export async function test_function(page) {
    await check_village_building_queue(page);
}

export async function login(page, username, password) {

    await page.goto('https://ts4.x1.europe.travian.com/');

    const usernameInput = await page.locator('input[name="name"]');
    const passwordInput = await page.locator('input[name="password"]');
    const loginButton = await page.locator('button[type="submit"]');

    await human.type(usernameInput, username, page);
    await human.type(passwordInput, password, page);

    await human.mmouse(page);
    await human.click(loginButton, page);
    await human.mmouse(page);

}

export async function get_villages_info(page) {

    await human.mmouse(page);

    const accountInfo = [];
    const villages = await get_villages(page);

    for (const village of villages) {
        
        accountInfo.push({
            village: village,
            resources: await get_village_resource(page, village.href),
            buildings: await get_village_buildings(page, village.href),
        });
        
    }

    await human.mmouse(page);
    await human.delay(page);



    return accountInfo;
    
}

export async function upgrade_slot(page, slot_url) {

    const availableSlots = await check_village_building_queue(page);
    if (!availableSlots) {
        console.log('No available slots');
        return false;
    }

    await page.goto(`https://ts4.x1.europe.travian.com${slot_url}`);
    await human.mmouse(page);
    await human.delay(page);

    const buttonUpgradeContainer = await page.waitForSelector('div.section1');
    const buttonUpgrade = await buttonUpgradeContainer.$('button');

    const buttonClass = await page.evaluate(el => el.getAttribute('class'), buttonUpgrade)
    if (buttonClass.includes('gold')) {
        return false;
    }

    await human.mmouse(page);
    await human.click(buttonUpgrade, page);

    return true;

}

export async function launch_raid_from_farm_list(page) {

    await page.goto('https://ts4.x1.europe.travian.com/build.php?id=39&gid=16&tt=99');
    await human.mmouse(page);
    await human.delay(page);

    const buttonRaid = await page.waitForSelector('button[value="Avvia"]');

    await human.mmouse(page);
    await human.click(buttonRaid, page);
    await human.delay(page);

}