import { test, expect } from '@playwright/test';
import { CreerProjetDto } from '@/presentation/api/dtos/creer-projet.dto';
import { AtOrganizationTypeSlug } from '@/infra/at/organization-type';
import { AtPerimeterScale } from '@/infra/at/perimeter';
import { LesCommunsProjetStatuts } from '@/domain/models/les-communs/projet-statuts';

const url = '/api/v1/projets';

test('Creer projet validation error', async ({ page }) => {
  const response = await page.request.post(url, {});
  console.dir(await response.text(), { depth: null });
  expect(response.status()).toBe(400);
  expect((await response.json())?.errors?.length).toBeGreaterThan(0);
});

test('Creer projet with required fields only', async ({ page }) => {
  const creerProjetDto: CreerProjetDto = {
    description: 'description',
    porteur: AtOrganizationTypeSlug.Association
  };
  const response = await page.request.post(url, {
    data: {
      data: creerProjetDto
    }
  });
  console.dir(await response.json(), { depth: null });
  expect(response.status()).toBe(201);
});

test('Creer projet with all fields', async ({ page }) => {
  const creerProjetDto: CreerProjetDto = {
    description: 'description',
    porteur: AtOrganizationTypeSlug.Association,
    zonesGeographiques: [
      {
        type: AtPerimeterScale.commune,
        code: 69266
      }
    ],
    etatAvancement: LesCommunsProjetStatuts.IDEE
  };
  const response = await page.request.post(url, {
    data: {
      data: creerProjetDto
    }
  });
  console.dir(await response.json(), { depth: null });
  expect(response.status()).toBe(201);
});

test("Ne peut pas créer un projet avec un id qui n'est pas un uuid.", async ({ page }) => {
  const creerProjetDto: CreerProjetDto = {
    id: 'e859d5bb-f1f0-4076-9453-ecbd9e003b5',
    description: 'description',
    porteur: AtOrganizationTypeSlug.Association,
    zonesGeographiques: [
      {
        type: AtPerimeterScale.commune,
        code: 69266
      }
    ],
    etatAvancement: LesCommunsProjetStatuts.IDEE
  };
  const response = await page.request.post(url, {
    data: {
      data: creerProjetDto
    }
  });
  console.dir(await response.json(), { depth: null });
  expect(response.status()).toBe(400);
});
