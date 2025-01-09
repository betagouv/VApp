import { Document, RulesetDefinition, Spectral } from '@stoplight/spectral-core';
import { pattern, schema, truthy } from '@stoplight/spectral-functions';
import { Json } from '@stoplight/spectral-parsers';
import { oas } from '@stoplight/spectral-rulesets';
import { oas3 } from '@stoplight/spectral-formats';

import { generateOpenApi } from '@/presentation/api/open-api';

(async () => {
  const myDocument = new Document(JSON.stringify(generateOpenApi()), Json);

  const spectral = new Spectral();
  spectral.setRuleset({
    extends: [oas as RulesetDefinition],
    rules: {
      'api-home': {
        description: 'APIs MUST have a root path (`/`) defined.',
        message:
          'Stop forcing all API consumers to visit documentation for basic interactions when the API could do that itself.',
        given: '$.paths',
        then: {
          field: '/',
          function: truthy
        },
        severity: 'warn'
      },

      'api-home-get': {
        description: 'APIs root path (`/`) MUST have a GET operation.',
        message: "Otherwise people won't know how to get it.",
        given: '$.paths[/]',
        then: {
          field: 'get',
          function: truthy
        },
        severity: 'warn'
      },

      // Author: Phil Sturgeon (https://github.com/philsturgeon)
      'no-numeric-ids': {
        description: 'Please avoid exposing IDs as an integer, UUIDs are preferred.',
        given: '$.paths..parameters[*].[?(@property === "name" && (@ === "id" || @.match(/(_id|Id)$/)))]^.schema',
        then: {
          function: schema,
          functionOptions: {
            schema: {
              type: 'object',
              not: {
                properties: {
                  type: {
                    const: 'integer'
                  }
                }
              },
              properties: {
                format: {
                  const: 'uuid'
                }
              }
            }
          }
        },
        severity: 'error'
      },

      // Author: Nauman Ali (https://github.com/naumanali-stoplight)
      'no-global-versioning': {
        description:
          'Using global versions just forces all your clients to do a lot more work for each upgrade. Please consider using API Evolution instead.',
        message: 'Server URL should not contain global versions',
        given: '$.servers[*].url',
        then: {
          function: pattern,
          functionOptions: {
            notMatch: '/v[1-9]'
          }
        },
        formats: [oas3],
        severity: 'warn'
      }
    }
  });

  const errors = await spectral.run(myDocument);

  if (errors.length > 0) {
    errors.map((error) => console.error(error));
    process.exit(1);
  }

  process.exit();
})();
