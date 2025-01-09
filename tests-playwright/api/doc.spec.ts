import { test, expect } from '@playwright/test';

const url = '/api/v1/';

test('API documentation', async ({ page }) => {
  const response = await page.request.get(url);
  expect(response.status()).toBe(200);
});
