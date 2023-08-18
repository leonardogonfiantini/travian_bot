import { humanType, humanClick, humanRandomMouseMove, randomDelay } from './human.js';

export async function getVillageResourcesInfo(page, village_url) {

    const info = [];

    // Go to resources page
    await page.goto(`https://ts4.x1.europe.travian.com/dorf1.php${village_url}`);
    await humanRandomMouseMove(page);

    // Resource fields
    const resourceContainer = await page.waitForSelector('div#resourceFieldContainer'); // Wait for the container to load
    const resources = await resourceContainer.$$('a'); // Locate the <a> elements

    for (const resource of resources) {
        const resourceClass = await resource.getAttribute('class');
        if (resourceClass.includes('villageCenter')) continue;

        const resourceLevel = resourceClass.match(/level(\d+)/)[1];
        const resourceType = resourceClass.match(/gid(\d+)/)[1];
        const resourceSlot = resourceClass.match(/buildingSlot(\d+)/)[1];
        const resourceHref = await resource.getAttribute('href');

        info.push({
            level: resourceLevel,
            type: resourceType === '1' ? 'wood' : resourceType === '2' ? 'clay' : resourceType === '3' ? 'iron' : 'crop',
            status: resourceClass.includes('underConstruction') ? 'under construcion' : 'normal',
            href: resourceHref,
            slot: resourceSlot,
        });
    }

    await humanRandomMouseMove(page);
    await randomDelay(page);

    return info;

}

export async function getVillageBuildingsInfo(page, village_url) {

    const info = [];

    // Go to buildings page
    await page.goto(`https://ts4.x1.europe.travian.com/dorf2.php${village_url}`);
    await humanRandomMouseMove(page);

    // Building fields
    const buildingContainer = await page.waitForSelector('div#villageContent'); 
    const buildings = await buildingContainer.$$('div.buildingSlot');

    for (const building of buildings) {
        
        const buildingName = await building.getAttribute('data-name');
        const buildingId = await building.getAttribute('data-building-id');
        
        const buildingTag = await building.$('a');
        const buildingClass = await buildingTag.getAttribute('class');
        const buildingLevel = await buildingTag.getAttribute('data-level');
        const buildinghref = await buildingTag.getAttribute('href');
        const buildingSlot = await building.getAttribute('data-aid')

        info.push({
            id: buildingId,
            name: buildingName,
            level: buildingLevel,
            status: buildingClass.includes('underConstruction') ? 'under construcion' : 'normal',
            href: buildinghref,
            slot: buildingSlot,
        })
        
    }

    await humanRandomMouseMove(page);
    await randomDelay(page);

    return info;

}

export async function getVillagesList(page) {

    const villages = [];

    //Go to the villages page
    await page.goto('https://ts4.x1.europe.travian.com/dorf1.php');
    await humanRandomMouseMove(page);

    // Get the villages
    const villageContainer = await page.waitForSelector('div.villageList');
    const villageList = await villageContainer.$$('div.listEntry');

    for (const village of villageList) {
        
        const villageTagA = await village.$('a');
        const villageHref = await villageTagA.getAttribute('href');

        const villageTagSpan = await village.$('span.coordinatesGrid');
        const villageName = await villageTagSpan.getAttribute('data-villagename');
        const villageCoordX = await villageTagSpan.getAttribute('data-x');
        const villageCoordY = await villageTagSpan.getAttribute('data-y');
        const villageId = await villageTagSpan.getAttribute('data-did');
        
        villages.push({
            name: villageName,
            href: villageHref,
            coordX: villageCoordX,
            coordY: villageCoordY,
            id: villageId,
        });
    }

    await humanRandomMouseMove(page);
    await randomDelay(page);

    return villages;

}