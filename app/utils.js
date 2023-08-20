import { humanRandomMouseMove, randomDelay } from './human.js';

export async function getVillageResourcesInfo(page, village_url) {
    const info = [];

    // Go to resources page
    await page.goto(`https://ts4.x1.europe.travian.com/dorf1.php${village_url}`);
    await humanRandomMouseMove(page);

    // Resource fields
    const resourceContainer = await page.waitForSelector('div#resourceFieldContainer');
    const resources = await resourceContainer.$$('a');

    for (const resource of resources) {
        const resourceClass = await resource.evaluate(el => el.getAttribute('class'));
        if (resourceClass.includes('villageCenter')) continue;

        const resourceLevel = resourceClass.match(/level(\d+)/)[1];
        const resourceType = resourceClass.match(/gid(\d+)/)[1];
        const resourceSlot = resourceClass.match(/buildingSlot(\d+)/)[1];
        const resourceHref = await resource.evaluate(el=> el.getAttribute('href'));

        info.push({
            level: resourceLevel,
            type: resourceType === '1' ? 'wood' : resourceType === '2' ? 'clay' : resourceType === '3' ? 'iron' : 'crop',
            status: resourceClass.includes('underConstruction') ? 'under construction' : 'normal',
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
        const buildingName = await building.evaluate(el => el.getAttribute('data-name'));
        const buildingId = await building.evaluate(el => el.getAttribute('data-building-id'));

        const buildingTag = await building.$('a');
        const buildingClass = await buildingTag.evaluate(el => el.getAttribute('class'));
        const buildingLevel = await buildingTag.evaluate(el => el.getAttribute('data-level'));
        const buildingHref = await buildingTag.evaluate(el => el.getAttribute('href'));
        const buildingSlot = await building.evaluate(el => el.getAttribute('data-aid'));

        info.push({
            id: buildingId,
            name: buildingName,
            level: buildingLevel,
            status: buildingClass.includes('underConstruction') ? 'under construction' : 'normal',
            href: buildingHref,
            slot: buildingSlot,
        });
    }

    await humanRandomMouseMove(page);
    await randomDelay(page);

    return info;
}

export async function getVillagesList(page) {
    const villages = [];

    // Go to the villages page
    await page.goto('https://ts4.x1.europe.travian.com/dorf1.php');
    await humanRandomMouseMove(page);

    // Get the villages
    const villageContainer = await page.waitForSelector('div.villageList');
    const villageList = await villageContainer.$$('div.listEntry');

    for (const village of villageList) {
        const villageTagA = await village.$('a');
        const villageHref = await page.evaluate(el => el.getAttribute('href'), villageTagA);

        const villageTagSpan = await village.$('span.coordinatesGrid');
        const villageName = await page.evaluate(el => el.getAttribute('data-villagename'), villageTagSpan);
        const villageCoordX = await page.evaluate(el => el.getAttribute('data-x'), villageTagSpan);
        const villageCoordY = await page.evaluate(el => el.getAttribute('data-y'), villageTagSpan);
        const villageId = await page.evaluate(el => el.getAttribute('data-did'), villageTagSpan);

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

export async function checkVillageBuildingList(page) {

    await page.goto('https://ts4.x1.europe.travian.com/dorf1.php');
    await humanRandomMouseMove(page);
    
    try {
        const buildingContainer = await page.waitForSelector('div.buildingList');
        const buildings = await buildingContainer.$$('div.name');


        if (buildings.length >= 2) {
            await humanRandomMouseMove(page);
            return false;
        }

        await humanRandomMouseMove(page);
        return true;

    } catch(e) {
        await humanRandomMouseMove(page);
        return true;
    }


}