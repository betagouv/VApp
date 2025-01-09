import { test, expect } from '@playwright/test';

const urls = [
  'accessibilite',
  'aide',
  'article',
  'budget',
  'cgu',
  'healthz',
  'mentions-legales',
  'politique-confidentialite',
  'stats'
];

test('all cms pages answer with success', async ({ page }) => {
  for (const url of urls) {
    const response = await page.request.get(url);
    expect(response.status()).toBe(200);
  }
});
