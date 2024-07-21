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
    await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();
    const cartBadge = await page.locator('.shopping_cart_badge').textContent();
    expect(cartBadge).toBe('2');
    await page.locator('.shopping_cart_link').click();

    await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');

    const cartItems = await page.locator('.cart_item').all();
    expect(cartItems.length).toBe(2);

    const expectedItems = [
      { name: 'Sauce Labs Backpack', price: '$29.99' },
      { name: 'Sauce Labs Bolt T-Shirt', price: '$15.99' }
    ];

    for (let i = 0; i < cartItems.length; i++) {
      const itemName = await cartItems[i].locator('.inventory_item_name').textContent();
      const itemPrice = await cartItems[i].locator('.inventory_item_price').textContent();
      expect(itemName).toBe(expectedItems[i].name);
      expect(itemPrice).toBe(expectedItems[i].price);
    }

    console.log('Success!');
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }
})();
