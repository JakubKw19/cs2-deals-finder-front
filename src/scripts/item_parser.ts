const LanguageHandler = {
    get: function (obj: any, prop: string) {
        return obj[prop.toLowerCase()];
    },
    has: function (obj: any, prop: string) {
        return prop.toLowerCase() in obj;
    }
};

// const dopplerPhases = {
//     418: 'Phase 1',
//     419: 'Phase 2',
//     420: 'Phase 3',
//     421: 'Phase 4',
//     415: 'Ruby',
//     416: 'Sapphire',
//     417: 'Black Pearl',
//     569: 'Phase 1',
//     570: 'Phase 2',
//     571: 'Phase 3',
//     572: 'Phase 4',
//     568: 'Emerald',
//     618: 'Phase 2',
//     619: 'Sapphire',
//     617: 'Black Pearl',
//     852: 'Phase 1',
//     853: 'Phase 2',
//     854: 'Phase 3',
//     855: 'Phase 4'
// };

interface IItemParser {

}

class ItemParser implements IItemParser {
    itemsGame: any;
    language: any;
    resp: any;
    constructor(itemsGame: any, language: any) {
        this.itemsGame = itemsGame;
        this.language = new Proxy(this._objectKeysToLowerCase(language || {}), LanguageHandler);
    }


    /*
        Calls toLowerCase on all object shallow keys, modifies in-place, not pure
     */
    _objectKeysToLowerCase(obj: any) {
        const keys = Object.keys(obj);
        let n = keys.length;
        while (n--) {
            const key = keys[n];
            const lower = key.toLowerCase();
            if (key !== lower) {
                obj[lower] = obj[key];
                delete obj[key];
            }
        }

        return obj
    }

    _getPrefabStickerAmount(prefabName: string) {
        const prefab = this.itemsGame.prefabs[prefabName];
        return Object.keys(prefab.stickers || {}).length;
    }

    _isWeapon(prefabName: string) {
        if (prefabName === 'melee_unusual' || prefabName === 'hands_paintable') return true;

        const prefab = this.itemsGame.prefabs[prefabName];
        const usedClasses = prefab && prefab.used_by_classes;

        return usedClasses && (usedClasses['terrorists'] || usedClasses['counter-terrorists']);
    }

    _getWeapons() {
        const weapons: { [key: string]: any } = {};
        for (const defIndex in this.itemsGame.items) {
            const item = this.itemsGame.items[defIndex];
            if (item.prefab && this._isWeapon(item.prefab)) {
                weapons[defIndex] = item;
            }
        }

        return weapons;
    }

    _getWeaponLanguageName(defIndex: string) {
        const item = this.itemsGame.items[defIndex];

        if (item.item_name) {
            return this._getLanguageValue(item.item_name);
        } else {
            const prefab = this.itemsGame.prefabs[item.prefab];
            return this._getLanguageValue(prefab.item_name);
        }
    }

    _getPaintKitIndex(name: string) {
        return Object.keys(this.itemsGame.paint_kits).find((paintIndex) => {
            const kit = this.itemsGame.paint_kits[paintIndex];

            if (kit.name === name) {
                return true;
            }
        })
    }

    _getLanguageValue(token: string) {
        return this.language[token.replace('#', '')];
    }

    _getCases() {
        const cases: { [key: string]: any } = {};

        // Iterate over all items in itemsGame
        for (const itemId of Object.keys(this.itemsGame.items)) {
            const item = this.itemsGame.items[itemId];

            // Check if the item is a case based on its prefab or other attributes
            if (item.prefab && item.prefab === 'weapon_case') {
                cases[itemId] = {
                    name: this._getLanguageValue(item.item_name),
                };
            }
        }
        return cases;
    }

    _getStickerCapsules() {
        const stickerCapusles: { [key: string]: any } = {};

        // Iterate over all items in itemsGame
        for (const itemId of Object.keys(this.itemsGame.items)) {
            const item = this.itemsGame.items[itemId];

            // Check if the item is a case based on its prefab or other attributes
            if (item.prefab && item.prefab === 'sticker_capsule') {
                stickerCapusles[itemId] = {
                    name: this._getLanguageValue(item.item_name),
                };
            }
        }
        return stickerCapusles;
    }

    _getCapsules() {
        const capsules: { [key: string]: any } = {};

        for (const itemId of Object.keys(this.itemsGame.items)) {
            const item = this.itemsGame.items[itemId];

            // Check if item is categorized as a capsule (sticker, patch, graffiti, etc.)
            if (this._isCapsule(item)) {
                const capsuleName = this._getLanguageValue(item.item_name || item.description_tag);

                capsules[itemId] = {
                    name: capsuleName,
                };
            }
        }

        return capsules;
    }

    _isCapsule(item: any) {
        // Check if the item prefab or name indicates it's a capsule
        const isCapsuleByPrefab = item.prefab && (
            item.prefab.includes('capsule') ||
            item.prefab === 'sticker_capsule'
        );

        // Check by name or description tag (e.g., items that start with 'sticker_capsule')
        const isCapsuleByName = item.item_name && item.item_name.toLowerCase().includes('capsule');
        const isCapsuleByDescription = item.description_tag && item.description_tag.toLowerCase().includes('capsule');

        return isCapsuleByPrefab || isCapsuleByName || isCapsuleByDescription;
    }

    _getWeaponPaints(weaponName: string) {
        const paints: { [key: string]: { name: string, min: number, max: number } } = {};

        for (const iconId of Object.keys(this.itemsGame.alternate_icons2.weapon_icons)) {
            const iconPath = this.itemsGame.alternate_icons2.weapon_icons[iconId].icon_path;
            if (iconPath.indexOf(weaponName) === -1) continue;

            const parsed = iconPath.match(/econ\/default_generated\/(.*)_/)[1];
            const paintName = parsed.replace(`${weaponName}_`, '');

            const index = this._getPaintKitIndex(paintName);

            if (index) {
                const kit = this.itemsGame.paint_kits[index];

                let name = this._getLanguageValue(kit.description_tag);

                // if (index in dopplerPhases) {
                //     name += ` (${dopplerPhases[parseInt(index) as keyof typeof dopplerPhases]})`;
                // }

                paints[index] = {
                    name,
                    min: parseFloat(kit.wear_remap_min || 0.06),
                    max: parseFloat(kit.wear_remap_max || 0.80),
                };
            }
        }

        return paints;
    }

    getStickers() {
        const stickers: { [key: string]: string } = {};

        for (const stickerId of Object.keys(this.itemsGame.sticker_kits)) {
            if (stickerId == '0') continue;

            const sticker = this.itemsGame.sticker_kits[stickerId];

            // Ignore graffiti
            if (!sticker.name.startsWith("spray_")) {
                stickers[stickerId] = this._getLanguageValue(sticker.item_name) as string;
            }
        }

        return stickers;
    }

    getFullResponse() {
        if (this.resp) return this.resp;

        const resp: { [key: string]: any } = {};

        const weapons = this._getWeapons();

        const cases = this._getCases();

        // const stickerCapsules = this._getStickerCapsules();

        const capsules = this._getCapsules();

        const weaponsResp: { [key: string]: any } = {};

        for (const defIndex of Object.keys(weapons)) {
            const weapon = weapons[defIndex];
            const paints = this._getWeaponPaints(weapon.name);

            if (Object.keys(paints).length === 0) continue;

            let type;
            if (weapon.prefab === 'hands_paintable') {
                type = 'Gloves'
            } else if (weapon.prefab === 'melee_unusual') {
                type = 'Knives'
            } else {
                type = 'Weapons'
            }

            weaponsResp[defIndex] = {
                name: this._getWeaponLanguageName(defIndex),
                type,
                stickerAmount: this._getPrefabStickerAmount(weapon.prefab),
                paints
            };
        }

        resp.weapons = weaponsResp;
        resp.stickers = this.getStickers();
        resp.cases = cases;
        // resp.stickerCapsules = stickerCapsules;
        resp.capsules = capsules;

        this.resp = resp;

        return resp;
    }
}

export default ItemParser;