import { test, expect } from '@playwright/test';

test('category accepts input', async ({ page }) => {
  await page.goto('http://localhost:5173/2024-01');
  await page.getByRole('link', { name: 'Setup' }).click();
  await page.getByPlaceholder('leisure').click();
  await page.getByPlaceholder('leisure').fill('abc');
  await page.locator('form').filter({ hasText: 'Create new category..Create' }).getByRole('button').click();
  await expect(page.locator('span').filter({ hasText: 'Abc' })).toBeVisible()
});

test('category accepts valid edit', async ({ page }) => {
  await page.goto('http://localhost:5173/setup');
  await page.getByPlaceholder('leisure').click();
  await page.getByPlaceholder('leisure').fill('asd');
  await page.locator('form').filter({ hasText: 'Create new category..Create' }).getByRole('button').click();
  await page.getByRole('button').nth(1).click();
  await page.getByLabel('Enter a category..').fill('hello');
  await page.getByRole('dialog').getByRole('button', { name: 'Submit' }).click();
  await expect(page.locator('span').filter({ hasText: 'Hello' })).toBeVisible()
});
test('category can be disabled and enabled', async ({ page }) => {
  await page.goto('http://localhost:5173/setup');
  await page.getByPlaceholder('leisure').click();
  await page.getByPlaceholder('leisure').fill('asd');
  await page.locator('form').filter({ hasText: 'Create new category..Create' }).getByRole('button').click();
  await page.getByRole('button').nth(2).click();
  await expect(page.getByText('Retired categories:')).toBeVisible()
  await page.locator('span').filter({ hasText: 'Asd' }).getByRole('button').click();
  await expect(page.getByRole('button').nth(2)).toBeVisible()
});

test('card accepts input', async ({ page }) => {
  await page.goto('http://localhost:5173/setup');
  await page.getByPlaceholder('1234').click();
  await page.getByPlaceholder('1234').fill('1233');
  await page.locator('form').filter({ hasText: 'Create new card..Create new' }).getByRole('button').click();
  await expect(page.locator('span').filter({ hasText: '1233' })).toBeVisible()
  
});

test('card accepts valid edit', async ({ page }) => {
  await page.goto('http://localhost:5173/setup');
  await page.getByPlaceholder('1234').click();
  await page.getByPlaceholder('1234').fill('1234');
  await page.locator('form').filter({ hasText: 'Create new card..Create new' }).getByRole('button').click();
  await page.getByRole('button').nth(2).click();
  await page.getByLabel('Enter a card..').fill('1235');
  await page.getByRole('dialog').getByRole('button', { name: 'Submit' }).click();
  await expect(page.locator('span').filter({ hasText: '1235' })).toBeVisible()
});

test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/setup');
  await page.getByPlaceholder('1234').click();
  await page.getByPlaceholder('1234').fill('1234');
  await page.locator('form').filter({ hasText: 'Create new card..Create new' }).getByRole('button').click();
  await page.getByRole('button').nth(3).click();
  await expect(page.getByText('Retired cards:')).toBeVisible()
  await page.locator('span').filter({ hasText: '1234' }).getByRole('button').click();
  await expect(page.getByRole('button').nth(3)).toBeVisible()
});
