const { chromium } = require('playwright');
const { expect } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {

    await page.goto('https://www.saucedemo.com/');

    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');

    await page.locator('[data-test="login-button"]').click();

    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    const removeButtonTShort = await page.locator('[data-test="remove-sauce-labs-backpack"]');
    await expect(removeButtonTShort).toHaveText('Remove')
    
    await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();
    const removeButtonTShort = await page.locator('[data-test="remove-sauce-labs-bolt-t-shirt"]');
    await expect(removeButtonTShort).toHaveText('Remove')
    
    const cartBadge = await page.locator('.shopping_cart_badge').textContent();
    expect(cartBadge).toBe('2');
    await page.locator('.shopping_cart_link').click();

    await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
    const cartItem = await page.locator('.cart_item').count();
    expect(cartItem).toBe(2);
    console.log('Sucsess!')
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }
})();
