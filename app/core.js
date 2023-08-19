import { humanType, humanClick, humanRandomMouseMove, randomDelay } from './human.js';
import { getVillagesList, getVillageBuildingsInfo, getVillageResourcesInfo } from './utils.js';

export async function login(page, username, password) {

    await page.goto('https://ts4.x1.europe.travian.com/logout');

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

    console.log(accountInfo)

    return accountInfo;
    
}
