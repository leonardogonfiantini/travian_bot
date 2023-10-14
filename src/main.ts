import * as bot from './core'

import {Page, Browser} from 'puppeteer';


(async () => {

    const bot_info = await bot.init_bot();

    const page : Page = bot_info.page;
    const browser : Browser = bot_info.browser;
    const username : string = bot_info.username || "";
    const password : string = bot_info.password || "";


    await new Promise(resolve => setTimeout(resolve, 2000))
    await bot.login(page, username, password);


    while(true) {

        try {
            
            //upgrade all the village resources level by level
            const villagesInfo = await bot.get_villages_info(page);

            let min_level = 16; 

            for (const villageInfo of villagesInfo) {
                if (villageInfo.village.name == '02') {
                    for (const resource of villageInfo.resources) {
                        if (resource.level < min_level) {
                            min_level = resource.level;
                        }
                    }
                }
            }

            await bot.launch_raid_from_farm_list(page);


            for (const villageInfo of villagesInfo) {
                if (villageInfo.village.name == '02') {
                    for (const resource of villageInfo.resources) {
                        if (resource.level == min_level && resource.status == 'normal') {
                            const status = await bot.upgrade_slot(page, resource.href);
                            if (status) break;
                        }
                    }
                }
            }

            await bot.launch_raid_from_farm_list(page);


        } catch(e) {

            await new Promise(resolve => setTimeout(resolve, 1000 * 60 * 2));
            await bot.login(page, username, password);

        }

    }

    // Close the browser
    await browser.close();
})();


