import { test, expect } from '@playwright/test';

test('operation gets created', async ({ page }) => {
  await page.goto('http://localhost:5173/2024-01');
  await page.getByRole('link', { name: 'Setup' }).click();
  await page.getByPlaceholder('leisure').click();
  await page.getByPlaceholder('leisure').fill('asd');
  await page.locator('form').filter({ hasText: 'Create new category..Create' }).getByRole('button').click();
  await page.getByPlaceholder('1234').click();
  await page.getByPlaceholder('1234').fill('0455');
  await page.locator('form').filter({ hasText: 'Create new card..Create new' }).getByRole('button').click();
  await page.getByRole('link', { name: 'Home' }).click();
  await page.getByRole('button', { name: 'New Operation' }).click();
  await page.getByPlaceholder('electricity').click();
  await page.getByPlaceholder('electricity').fill('leisure');
  await page.getByPlaceholder('15.75').click();
  await page.getByPlaceholder('15.75').fill('14');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByRole('cell', { name: 'leisure' })).toBeVisible()
});
test('operation editable', async ({ page }) => {
  await page.goto('http://localhost:5173/2024-01');
  await page.getByRole('link', { name: 'Setup' }).click();
  await page.getByPlaceholder('leisure').click();
  await page.getByPlaceholder('leisure').fill('asd');
  await page.locator('form').filter({ hasText: 'Create new category..Create' }).getByRole('button').click();
  await page.getByPlaceholder('1234').click();
  await page.getByPlaceholder('1234').fill('0455');
  await page.locator('form').filter({ hasText: 'Create new card..Create new' }).getByRole('button').click();
  await page.getByRole('link', { name: 'Home' }).click();
  await page.getByRole('button', { name: 'New Operation' }).click();
  await page.getByPlaceholder('electricity').click();
  await page.getByPlaceholder('electricity').fill('leisure');
  await page.getByPlaceholder('15.75').click();
  await page.getByPlaceholder('15.75').fill('14');
  await page.getByRole('button', { name: 'Submit' }).click()  
  await page.getByRole('button').nth(3).click()  
  await page.getByRole('button').nth(3).click();
  await page.getByLabel('Enter the amount..').fill('90');
  await page.getByLabel('Enter the date..').fill('2024-01-09');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByRole('row', { name: 'leisure -90€ Asd 2024-01-09' }).locator('#red')).toBeVisible()
});
