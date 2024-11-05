import './loadEnv';
import fs from 'node:fs';
import { parse } from 'csv-parse';
import { aideRepository } from '@/infra/repositories/aide.repository';
import { aideAidesTerritoiresDtoSchema } from '@/infra/dtos/aide-aides-territoires.dto';

// id
// slug
// url
// name
// name_initial
// short_title
// financers
// financers_full
// instructors
// instructors_full
// programs
// description
// eligibility
// perimeter
// perimeter_scale
// mobilization_steps
// origin_url
// categories
// is_call_for_project
// application_url
// targeted_audiences
// aid_types
// aid_types_full
// is_charged
// destinations
// start_date
// predeposit_date
// submission_deadline
// subvention_rate_lower_bound
// subvention_rate_upper_bound
// subvention_comment
// loan_amount
// recoverable_advance_amount
// contact
// recurrence
// project_examples
// import_data_url
// import_data_mention
// import_share_licence
// date_created
// date_updated
// project_references
// european_aid
// is_live
// description_md
// eligibility_md
// token_numb_description_md
// token_numb_description
// token_numb_eligibility_md
// token_numb_eligibility

const processFile = async () => {
  const records = [];
  const parser = fs.createReadStream(`${__dirname}/../data/data_at_select_ai.csv`).pipe(
    parse({
      // CSV options if any
      columns: true
    })
  );
  for await (const record of parser) {
    if (record.id === 'id') {
      continue;
    }

    const aideAidesTerritoiresDto = aideAidesTerritoiresDtoSchema.parse(record);
    records.push(aideAidesTerritoiresDto);

    await aideRepository.addFromAideTerritoires(aideAidesTerritoiresDto);
  }

  return records;
};

(async () => {
  await processFile();
})();
