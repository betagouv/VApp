import fs from 'node:fs';
import { parse } from 'csv-parse';
import { stringify } from 'csv-stringify';
const TurndownService = require('turndown');

const turndownService = new TurndownService({
  bulletListMarker: '-'
});
const __dirname = new URL('.', import.meta.url).pathname;

const processFile = async () => {
  const records = [];
  const parser = fs.createReadStream(`${__dirname}../data/data_at_select_full.csv`).pipe(
    parse({
      // CSV options if any
    })
  );
  for await (const record of parser) {
    const [_, id, titre, description] = record;

    // Work with each record
    records.push([id, titre, turndownService.turndown(description).replaceAll(' ', ' ')]);
  }
  return records;
};

(async () => {
  const records = await processFile();
  const ws = fs.createWriteStream(`${__dirname}../data/data_at_select_full_md.csv`);
  stringify(records).pipe(ws);
})();
