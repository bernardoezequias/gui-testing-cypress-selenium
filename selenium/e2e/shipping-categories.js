const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

describe('shipping categories', () => {
  let driver;

  before(async () => {
    driver = await new Builder().forBrowser('firefox').build();
  });

  after(async () => {
    await driver.quit();
  });

  beforeEach(async () => {
    driver.manage().deleteAllCookies();
    await driver.get('http://localhost:9990/admin');
    // await driver.get('http://150.165.75.99:9990/admin');
    await driver.findElement(By.id('_username')).sendKeys('sylius');
    await driver.findElement(By.id('_password')).sendKeys('sylius');
    await driver.findElement(By.css('.primary')).click();
    // await driver.sleep(1000);
  });

  // Remove .only and implement others test cases!
  it('create a new shipping category', async () => {
    // Click in shipping categories in side menu
    await driver.findElement(By.linkText('Shipping categories')).click();

    // Click on create button
    const buttons = await driver.findElements(By.css('*[class^="ui labeled icon button  primary "]'));
    await buttons[0].click();

    // Type category code
    await driver.findElement(By.id('sylius_shipping_category_code')).sendKeys('33');
    // Type category name
    await driver.findElement(By.id('sylius_shipping_category_name')).sendKeys('33');
    // Type category description
    await driver.findElement(By.id('sylius_shipping_category_description')).sendKeys('3333');

    // Click on create button
    const buttonToCreate = await driver.findElements(By.css('*[class^="ui labeled icon primary button"]'));
    await buttonToCreate[0].click();

    // Assert that shipping category has been created.
    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('Shipping category has been successfully created.'));
  });

  it('try to create an already existing shipping category', async () => {
    await driver.findElement(By.linkText('Shipping categories')).click();

    const buttons = await driver.findElements(By.css('*[class^="ui labeled icon button  primary "]'));
    await buttons[0].click();

    await driver.findElement(By.id('sylius_shipping_category_code')).sendKeys('33');
    await driver.findElement(By.id('sylius_shipping_category_name')).sendKeys('33');
    await driver.findElement(By.id('sylius_shipping_category_description')).sendKeys('3333');

    const buttonToCreate = await driver.findElements(By.css('*[class^="ui labeled icon primary button"]'));
    await buttonToCreate[0].click();

    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('This form contains errors.'));
  });

  it('search for a shipping category', async () => {
    await driver.findElement(By.linkText('Shipping categories')).click();

    const dropdown = await driver.findElement(By.id('criteria_search_type'));
    await dropdown.click();
    await dropdown.findElement(By.css('option[value="contains"]')).click();

    await driver.findElement(By.id('criteria_search_value')).sendKeys('33');
    const buttonToSearch = await driver.findElements(By.css('*[class^="ui labeled icon primary button"]'));
    if (buttonToSearch.length > 0) {
        await buttonToSearch[0].click();
    } else {
        console.error("Search button not found.");
    }
   
    const tBody = await driver.findElement(By.tagName('tbody')).getText();
    assert(tBody.includes('33'));
  });

  it('search for a non-existing shipping category', async () => {
    await driver.findElement(By.linkText('Shipping categories')).click();
    await driver.findElement(By.id('criteria_search_type')).select('contains');
    await driver.findElement(By.id('criteria_search_value')).sendKeys('non_existing_category_name');
    await driver.findElement(By.css('*[class^="ui blue labeled icon button"]')).click();
    const tbody = await driver.findElement(By.tagName('tbody')).getText();
    assert(!tbody.includes('non_existing_category_name'));
  });

  it('search for an empty shipping category', async () => {
  await driver.findElement(By.linkText('Shipping categories')).click();
  await driver.findElement(By.id('criteria_search_type')).select('contains');
  await driver.findElement(By.id('criteria_search_value')).sendKeys('{selectall}{backspace}');
  await driver.findElement(By.css('*[class^="ui blue labeled icon button"]')).click();
  const tbody = await driver.findElement(By.tagName('tbody')).findElements(By.tagName('tr'));
  assert(tbody.length === 0);
  });

  it('edit a shipping category name', async () => {
    await driver.findElement(By.linkText('Shipping categories')).click();

    const dropdown = await driver.findElement(By.id('criteria_search_type'));
    await dropdown.click();
    await dropdown.findElement(By.css('option[value="contains"]')).click();

    await driver.findElement(By.id('criteria_search_value')).sendKeys('33');
    const buttonToSearch = await driver.findElements(By.css('*[class^="ui labeled icon primary button"]'));
    if (buttonToSearch.length > 0) {
        await buttonToSearch[0].click();
    } else {
        console.error("Search button not found.");
    }

    await driver.findElement(By.css('body > div.admin-layout.admin-layout--open > div.admin-layout__body > div.admin-layout__content > div.sylius-grid-wrapper > div.ui.segment.spaceless.sylius-grid-table-wrapper > table > tbody > tr > td:nth-child(6) > div > a')).click();
    await driver.findElement(By.id('sylius_shipping_category_name')).sendKeys('44');
    await driver.findElement(By.id('sylius_save_changes_button')).click();

    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('Shipping category has been successfully updated.'));


  });

  it('edit a non-existing shipping category', async () => {
    await driver.findElement(By.linkText('Shipping categories')).click();
    await driver.findElement(By.id('criteria_search_type')).select('contains');
    await driver.findElement(By.id('criteria_search_value')).sendKeys('non_existing_category_name');
    await driver.findElement(By.css('*[class^="ui blue labeled icon button"]')).click();
    const tbody = await driver.findElement(By.tagName('tbody')).getText();
    assert(!tbody.includes('non_existing_category_name'));
    // assert(await driver.findElement(By.css('button.edit-button')).getAttribute('disabled'));
  });

  it('view details of a shipping category', async () => {
    await driver.findElement(By.linkText('Shipping categories')).click();
    await driver.findElement(By.id('criteria_search_type')).select('contains');
    await driver.findElement(By.id('criteria_search_value')).sendKeys(33);
    await driver.findElement(By.css('*[class^="ui blue labeled icon button"]')).click();
    await driver.findElement(By.css('tbody > tr:first-child > td:nth-child(6) > div > a:nth-child(1)')).click();
    assert(await driver.findElement(By.css('[data-testid="shipping-category-code"]')).getText() === '33');
    assert(await driver.findElement(By.css('[data-testid="shipping-category-name"]')).getText() === '33');
    assert(await driver.findElement(By.css('[data-testid="shipping-category-description"]')).getText() === '3333');
  });

  it('delete a non-existing shipping category', async () => {
    await driver.findElement(By.linkText('Shipping categories')).click();
    await driver.findElement(By.id('criteria_search_type')).select('contains');
    await driver.findElement(By.id('criteria_search_value')).sendKeys('non_existing_category_name');
    await driver.findElement(By.css('*[class^="ui blue labeled icon button"]')).click();
    const tbody = await driver.findElement(By.tagName('tbody')).getText();
    assert(!tbody.includes('non_existing_category_name'));
    // assert(await driver.findElement(By.css('button.delete-button')).getAttribute('disabled'));
  });


  it('delete a category', async () => {
    await driver.findElement(By.linkText('Shipping categories')).click();

    const dropdown = await driver.findElement(By.id('criteria_search_type'));
    await dropdown.click();
    await dropdown.findElement(By.css('option[value="contains"]')).click();

    await driver.findElement(By.css('div.admin-layout.admin-layout--open div.admin-layout__body div.admin-layout__content div.sylius-grid-wrapper div.ui.segment.spaceless.sylius-grid-table-wrapper table tbody tr td:nth-child(6) > div > form > button')).click();
    await driver.findElement(By.id('confirmation-button')).click();

    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('Shipping category has been successfully deleted.'));
  });

  // Implement the remaining test cases in a similar manner
});
