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
    const dropdown = await driver.findElement(By.id('criteria_search_type'));
    await dropdown.click();
    await dropdown.findElement(By.css('option[value="contains"]')).click();
    await driver.findElement(By.id('criteria_search_value')).sendKeys('55');
    await driver.findElement(By.css('*[class^="ui blue labeled icon button"]')).click();
    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('There are no results to display'));
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

  it('check if a category that is created not exist', async () => {
    await driver.findElement(By.linkText('Shipping categories')).click();
    const dropdown = await driver.findElement(By.id('criteria_search_type'));
    await dropdown.click();
    await dropdown.findElement(By.css('option[value="not_equal"]')).click();
    await driver.findElement(By.id('criteria_search_value')).sendKeys('33');
    await driver.findElement(By.css('*[class^="ui blue labeled icon button"]')).click();
    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('There are no results to display'));
  });
  
  it('check if a category that is created, exist', async () => {
    await driver.findElement(By.linkText('Shipping categories')).click();
    const dropdown = await driver.findElement(By.id('criteria_search_type'));
    await dropdown.click();
    await dropdown.findElement(By.css('option[value="equal"]')).click();
    await driver.findElement(By.id('criteria_search_value')).sendKeys('33');
    await driver.findElement(By.css('*[class^="ui blue labeled icon button"]')).click();
    const tbody = await driver.findElement(By.tagName('tbody')).getText();
    assert(tbody.includes('33'));
  });
  
  it('check if a category name starts with a char', async () => {
    await driver.findElement(By.linkText('Shipping categories')).click();
    const dropdown = await driver.findElement(By.id('criteria_search_type'));
    await dropdown.click();
    await dropdown.findElement(By.css('option[value="starts_with"]')).click();
    await driver.findElement(By.id('criteria_search_value')).sendKeys('3');
    await driver.findElement(By.css('*[class^="ui blue labeled icon button"]')).click();
    const tbody = await driver.findElement(By.tagName('tbody')).getText();
    assert(tbody.includes('33'));
  });

  it('check if a category name ends with a char', async () => {
    await driver.findElement(By.linkText('Shipping categories')).click();
    const dropdown = await driver.findElement(By.id('criteria_search_type'));
    await dropdown.click();
    await dropdown.findElement(By.css('option[value="ends_with"]')).click();
    await driver.findElement(By.id('criteria_search_value')).sendKeys('5');
    await driver.findElement(By.css('*[class^="ui blue labeled icon button"]')).click();
    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('There are no results to display'));
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
