import { generateOpenApi as tsRestGenerateOpenApi } from '@ts-rest/open-api';
import { SecurityRequirementObject } from 'openapi3-ts/oas31';
import { contract } from '@/presentation/api/contracts';
import { criteres } from '@/infra/ai/prompts/scoring';

const hasCustomTags = (metadata: unknown): metadata is { openApiTags: string[] } => {
  return !!metadata && typeof metadata === 'object' && 'openApiTags' in metadata;
};

const hasSecurity = (metadata: unknown): metadata is { openApiSecurity: SecurityRequirementObject[] } => {
  return !!metadata && typeof metadata === 'object' && 'openApiSecurity' in metadata;
};

export const generateOpenApi = (version: string = 'v1') =>
  tsRestGenerateOpenApi(
    contract,
    {
      info: {
        title: `${process.env.NEXT_PUBLIC_APP_NAME} - Documentation API`,
        version,
        contact: {
          url: 'http://vapp.beta.gouv.fr',
          name: 'Johan Dufour',
          email: 'johan.dufour@beta.gouv.fr'
        },
        description: `L'API **VApp** expose des points d'entrée permettant d'attribuer un **score de compatibilité** à des **aides** par rapport à un **projet**.
Lors d'une recherche d'aides, les aides suggérées proviennent d'**[Aides Territoires](https://aides-territoires.beta.gouv.fr/)**.
D'autres **fournisseurs de données** pourraient être proposés à l'avenir.

### Attribuer un score à mes aides

Grâce au point d'entrée de *scoring*
\`POST /api/v1/projets/{projetId}/aides/scoring\`,
vous pouvez déjà attribuer un score à vos propres aides par rapport à un projet.

### Score de compatibilité
${criteres}

### JSON:API
Le format de cette API s'appuie sur la spécification [JSON:API](https://jsonapi.org/).

### Clé d'API et autres demandes
Pour toute demande, vous pouvez [créer un nouveau ticket sur **GitHub**](https://github.com/betagouv/VApp/issues/new) ou nous contacter sur **Tchap** ou **Mattermost**.

### Liens
- https://beta.gouv.fr/startups/vapp.html
- https://github.com/betagouv/VApp
`
      },
      components: {
        securitySchemes: {
          'API Key': {
            name: 'x-api-Key',
            type: 'apiKey',
            in: 'header',
            description: process.env.DOCUMENTATION_API_KEY
              ? `You may use \`${process.env.DOCUMENTATION_API_KEY}\` for testing purpose`
              : ''
          }
        }
      },
      servers: [`${process.env.NEXT_PUBLIC_SITE_URL}`]
    },
    {
      setOperationId: true,
      operationMapper: (operation, appRoute) => ({
        ...operation,
        ...(hasCustomTags(appRoute.metadata)
          ? {
              tags: appRoute.metadata.openApiTags
            }
          : {}),
        ...(hasSecurity(appRoute.metadata)
          ? {
              security: appRoute.metadata.openApiSecurity
            }
          : {})
      })
    }
  );
