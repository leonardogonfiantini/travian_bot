import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import dotenv from 'dotenv';

import { login, getVillagesInfo, testFunction, upgradeSlot, launchRaidFromGoldList } from './core.js'

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

    await new Promise(resolve => setTimeout(resolve, 2000))

    await login(page, username, password);


    while(true) {

        await launchRaidFromGoldList(page);

        //upgrade all the village resources level by level
        const villagesInfo = await getVillagesInfo(page);

        let min_level = 16; 

        for (const villageInfo of villagesInfo) {  
            for (const resource of villageInfo.resources) {
                if (resource.level < min_level && resource.type != 'crop') {
                    min_level = resource.level;
                }
            }
        }

        for (const villageInfo of villagesInfo) {
            for (const resource of villageInfo.resources) {
                if (resource.level == min_level && resource.status == 'normal' && resource.type != 'crop') {
                    const status = await upgradeSlot(page, resource.href);
                    if (status) break;
                }
            }
        }

        await new Promise(resolve => setTimeout(resolve, 1000 * 60 * 2));

    }

    // Close the browser
    await browser.close();
})();



// while(true) {

//     await getVillagesInfo(page);
//     await launchRaidFromGoldList(page);

//     await new Promise(resolve => setTimeout(resolve, 1000 * 60 * 5));
// }

//  while(true) {

//         //upgrade all the village resources level by level
//         const villagesInfo = await getVillagesInfo(page);

//         let min_level = 16; 

//         for (const villageInfo of villagesInfo) {  
//             for (const resource of villageInfo.resources) {
//                 if (resource.level < min_level) {
//                     min_level = resource.level;
//                 }
//             }
//         }

//         for (const villageInfo of villagesInfo) {
//             for (const resource of villageInfo.resources) {
//                 if (resource.level == min_level && resource.status == 'normal') {
//                     const status = await upgradeSlot(page, resource.href);
//                     if (status) break;
//                 }
//             }
//         }

//         await new Promise(resolve => setTimeout(resolve, 1000 * 60 * 20));

//     }