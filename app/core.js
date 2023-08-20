import { humanType, humanClick, humanRandomMouseMove, randomDelay } from './human.js';
import { getVillagesList, getVillageBuildingsInfo, getVillageResourcesInfo, checkVillageBuildingList } from './utils.js';

export async function testFunction(page) {
    await checkVillageBuildingList(page);
}

export async function login(page, username, password) {

    await page.goto('https://ts4.x1.europe.travian.com/');

    const usernameInput = await page.locator('input[name="name"]');
    const passwordInput = await page.locator('input[name="password"]');
    const loginButton = await page.locator('button[type="submit"]');

    await humanType(usernameInput, username, page);
    await humanType(passwordInput, password, page);

    await humanRandomMouseMove(page);
    await humanClick(loginButton, page);
    await humanRandomMouseMove(page);

}

export async function getVillagesInfo(page) {

    await humanRandomMouseMove(page);

    const accountInfo = [];
    const villages = await getVillagesList(page);

    for (const village of villages) {
        
        accountInfo.push({
            village: village,
            resources: await getVillageResourcesInfo(page, village.href),
            buildings: await getVillageBuildingsInfo(page, village.href),
        });
        
    }

    await humanRandomMouseMove(page);
    await randomDelay(page);



    return accountInfo;
    
}

export async function upgradeSlot(page, slot_url) {

    const availableSlots = await checkVillageBuildingList(page);
    if (!availableSlots) {
        console.log('No available slots');
        return false;
    }

    await page.goto(`https://ts4.x1.europe.travian.com${slot_url}`);
    await humanRandomMouseMove(page);
    await randomDelay(page);

    const buttonUpgradeContainer = await page.waitForSelector('div.section1');
    const buttonUpgrade = await buttonUpgradeContainer.$('button');

    const buttonClass = await page.evaluate(el => el.getAttribute('class'), buttonUpgrade)
    if (buttonClass.includes('gold')) {
        return false;
    }

    await humanRandomMouseMove(page);
    await humanClick(buttonUpgrade, page);

    return true;

}