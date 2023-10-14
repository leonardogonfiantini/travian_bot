import * as human from './human';
import {Page} from 'puppeteer';

export async function get_village_resource(page : Page, village_url : string) {
    const info : any[] = [];

    // Go to resources page
    await page.goto(`https://ts4.x1.europe.travian.com/dorf1.php${village_url}`);
    await human.mmouse(page);

    // Resource fields
    const resourceContainer = await page.waitForSelector('div#resourceFieldContainer');
    if (!resourceContainer) {
        return info;
    }

    const resources = await resourceContainer.$$('a');

    if (!resources) {
        return info;
    }

    for (const resource of resources) {
        const resourceClass = await resource.evaluate(el => el.getAttribute('class'));
        if (!resourceClass) return info;
        if (resourceClass.includes('villageCenter')) continue;

        const matchLevel = resourceClass.match(/level(\d+)/);
        const resourceLevel = matchLevel ? matchLevel[1] : "";

        const matchType = resourceClass.match(/gid(\d+)/);
        const resourceType = matchType ? matchType[1] : "";

        const matchSlot = resourceClass.match(/buildingSlot(\d+)/);
        const resourceSlot = matchSlot ? matchSlot[1] : "";

        const resourceHref = await resource.evaluate(el=> el.getAttribute('href')) || "";

        info.push({
            level: resourceLevel,
            type: resourceType === '1' ? 'wood' : resourceType === '2' ? 'clay' : resourceType === '3' ? 'iron' : 'crop',
            status: resourceClass.includes('underConstruction') ? 'under construction' : 'normal',
            href: resourceHref,
            slot: resourceSlot,
        });
    }

    await human.mmouse(page);
    await human.delay();

    return info;
}

export async function get_village_buildings(page : Page, village_url : string) {
    const info : any[] = [];

    // Go to buildings page
    await page.goto(`https://ts4.x1.europe.travian.com/dorf2.php${village_url}`);
    await human.mmouse(page);

    // Building fields
    const buildingContainer = await page.waitForSelector('div#villageContent');
    if (!buildingContainer) {
        return info;
    }
    const buildings = await buildingContainer.$$('div.buildingSlot');
    if (!buildings) {
        return info;
    }

    for (const building of buildings) {
        const buildingName = await building.evaluate(el => el.getAttribute('data-name'));
        const buildingId = await building.evaluate(el => el.getAttribute('data-building-id'));

        const buildingTag = await building.$('a');
        if (!buildingTag) continue;

        const buildingClass = await buildingTag.evaluate(el => el.getAttribute('class'));
        const buildingLevel = await buildingTag.evaluate(el => el.getAttribute('data-level'));
        const buildingHref = await buildingTag.evaluate(el => el.getAttribute('href'));
        const buildingSlot = await building.evaluate(el => el.getAttribute('data-aid'));

        if (!buildingClass)
            continue;

        info.push({
            id: buildingId,
            name: buildingName,
            level: buildingLevel,
            status: buildingClass.includes('underConstruction') ? 'under construction' : 'normal',
            href: buildingHref,
            slot: buildingSlot,
        });
    }

    await human.mmouse(page);
    await human.delay();

    return info;
}

export async function get_villages(page : Page) {
    const villages : any[] = [];

    // Go to the villages page
    await page.goto('https://ts4.x1.europe.travian.com/dorf1.php');
    await human.mmouse(page);

    // Get the villages
    const villageContainer = await page.waitForSelector('div.villageList');

    if (!villageContainer) {
        return villages;
    }

    const villageList = await villageContainer.$$('div.listEntry');

    if (!villageList) {
        return villages;
    }

    for (const village of villageList) {
        const villageTagA = await village.$('a');
        const villageHref = await page.evaluate(el => el ? el.getAttribute('href') : "", villageTagA);

        const villageTagSpan = await village.$('span.coordinatesGrid');
        const villageName = await page.evaluate(el => el ? el.getAttribute('data-villagename') : "", villageTagSpan);
        const villageCoordX = await page.evaluate(el => el ? el.getAttribute('data-x') : "", villageTagSpan);
        const villageCoordY = await page.evaluate(el => el ? el.getAttribute('data-y') : "", villageTagSpan);
        const villageId = await page.evaluate(el => el ? el.getAttribute('data-did') : "", villageTagSpan);

        villages.push({
            name: villageName,
            href: villageHref,
            coordX: villageCoordX,
            coordY: villageCoordY,
            id: villageId,
        });
    }

    await human.mmouse(page);
    await human.delay();

    return villages;
}

export async function check_village_building_queue(page : Page) {

    await page.goto('https://ts4.x1.europe.travian.com/dorf1.php');
    await human.mmouse(page);
    
    try {
        const buildingContainer = await page.waitForSelector('div.buildingList');

        if (!buildingContainer) {
            await human.mmouse(page);
            return true;
        }

        const buildings = await buildingContainer.$$('div.name');

        if (!buildings) {
            await human.mmouse(page);
            return true;
        }


        if (buildings.length >= 2) {
            await human.mmouse(page);
            return false;
        }

        await human.mmouse(page);
        return true;

    } catch(e) {
        await human.mmouse(page);
        return true;
    }


}