import './loadEnv';
import fs from 'node:fs';
import { parse } from 'csv-parse';
import { aideRepository } from '@/infra/repositories/aide.repository';
import { aideAidesTerritoiresDtoSchema } from '@/infra/dtos/aide-aides-territoires.dto';

const processFile = async () => {
  const records = [];
  const parser = fs.createReadStream(`${__dirname}/../data/data_at_select_md.csv`).pipe(
    parse({
      // CSV options if any
    })
  );
  for await (const record of parser) {
    const [id, nom, description] = record;
    if (id === 'id') {
      continue;
    }

    const aideAidesTerritoiresDto = aideAidesTerritoiresDtoSchema.parse({
      id: Number(id),
      nom,
      description
    });
    records.push(aideAidesTerritoiresDto);

    await aideRepository.addFromAideTerritoires(aideAidesTerritoiresDto);
  }

  return records;
};

(async () => {
  await processFile();
})();
