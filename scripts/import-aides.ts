import './loadEnv';
import fs from 'node:fs';
import { parse } from 'csv-parse';
import { aideRepository } from '@/infra/repositories/at-aide-repository';
import { atAidSchema } from '@/infra/at/aid';

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

const pythonJsonParse = (pythonJsonString: string) =>
  JSON.parse(
    pythonJsonString
      .replaceAll(", '", ', "')
      .replaceAll("', ", '", ')
      // array start & end
      .replaceAll("['", '["')
      .replaceAll("']", '"]')
      // object
      // start & end
      .replaceAll("{'", '{"')
      .replaceAll("'}", '"}')
      // properties
      .replaceAll("': '", '": "') // first string
      .replaceAll("': ", '": ') // then number
      .replaceAll("'}", '"}')
      .replaceAll(': None', ': "None"')
      .replaceAll('\\xa0', ' ')
  );

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

    const atAid = atAidSchema.parse({
      ...record,
      id: Number(record.id),
      targeted_audiences: pythonJsonParse(record.targeted_audiences),
      token_numb_description: Number(record.token_numb_description),
      token_numb_eligibility: Number(record.token_numb_eligibility),
      financers: pythonJsonParse(record.financers),
      financers_full: pythonJsonParse(record.financers_full),
      destinations: pythonJsonParse(record.destinations),
      mobilization_steps: pythonJsonParse(record.mobilization_steps),
      is_charged: record.is_charged === 'true',
      aid_types: pythonJsonParse(record.aid_types),
      aid_types_full: pythonJsonParse(record.aid_types_full),
      categories: pythonJsonParse(record.categories),
      programs: pythonJsonParse(record.programs)
    });
    records.push(atAid);

    await aideRepository.addFromAideTerritoires(atAid);
  }

  return records;
};

(async () => {
  await processFile();
})();
