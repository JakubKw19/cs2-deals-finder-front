'use server';
import fs from 'fs';
import vdf from 'simple-vdf';
import ItemParser from './item_parser';

let page = 0;

export async function fetchItems() {
    // const response = await fetch(`https://csfloat.com/api/v1/listings?limit=50&page=${page}`, {
    //     method: 'GET',
    //     headers: {
    //         'Authorization': `${process.env.CSFLOAT_API_KEY}`, // Add your API key if needed
    //         'Content-Type': 'application/json',
    //     },
    // });

    const itemsFileUrl = 'https://raw.githubusercontent.com/SteamDatabase/GameTracking-CS2/refs/heads/master/game/csgo/pak01_dir/scripts/items/items_game.txt';
    const englishUrl = 'https://raw.githubusercontent.com/SteamDatabase/GameTracking-CS2/refs/heads/master/game/csgo/pak01_dir/resource/csgo_english.txt';

    let itemParser;
    async function updateItems() {
        try {
            const resp = await fetch(itemsFileUrl);
            const data = await resp.text();
            fs.writeFile('items_game.txt', data, () => {
                console.log('Saved items_game.txt');
            });

            const langResp = await fetch(englishUrl);
            const langData = await langResp.text();
            fs.writeFile('csgo_english.txt', langData, () => {
                console.log('Saved csgo_english.txt');
            });

            itemParser = new ItemParser(vdf.parse(data).items_game, vdf.parse(langData).lang.Tokens);
        } catch (e) {
            console.error(e);
        }
    }

    if (fs.existsSync('items_game.txt') && fs.existsSync('items_game.txt')) {
        const itemsGame = fs.readFileSync('items_game.txt', 'utf8');
        // itemParser = new ItemParser(vdf.parse(itemsGame)['items_game']);

        const english = fs.readFileSync('csgo_english.txt', 'utf8');
        itemParser = new ItemParser(vdf.parse(itemsGame).items_game, vdf.parse(english).lang.Tokens);
    } else {
        updateItems();
    }
    return itemParser;

    // if (!itemParser) {
    //     console.error('Failed to parse items_game.txt');
    //     return;
    // }
    // const items = itemParser.getFullResponse();
    // console.log(items);
}

fetchItems();