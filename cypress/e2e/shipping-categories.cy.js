describe('shipping categories', () => {
  beforeEach(() => {
    cy.visit('/admin');
    cy.get('[id="_username"]').type('sylius');
    cy.get('[id="_password"]').type('sylius');
    cy.get('.primary').click();
  });
  // Remove .only and implement others test cases!
  it('create a new shipping category', () => {
    // Click in shipping categories in side menu
    cy.clickInFirst('a[href="/admin/shipping-categories/"]');
    // Click on create button
    cy.get('*[class^="ui labeled icon button  primary "]').click();
    // Type category code
    cy.get('[id="sylius_shipping_category_code"]').type('33');
    // Type category name
    cy.get('[id="sylius_shipping_category_name"]').type('33');
    // Type category description
    cy.get('[id="sylius_shipping_category_description"]').type('3333');

    // Click on create button
    cy.get('*[class^="ui labeled icon primary button"]').scrollIntoView().click();
    // Assert that shipping category has been created.
    cy.get('body').should('contain', 'Shipping category has been successfully created.');
  });

  it('try to create an already existing shipping category', () => {
    cy.clickInFirst('a[href="/admin/shipping-categories/"]');
    
    cy.get('*[class^="ui labeled icon button  primary "]').click();
    cy.get('[id="sylius_shipping_category_code"]').type('33');
    cy.get('[id="sylius_shipping_category_name"]').type('33');
    cy.get('[id="sylius_shipping_category_description"]').type('3333');

    cy.get('*[class^="ui labeled icon primary button"]').scrollIntoView().click();
    cy.get('body').should('contain', 'This form contains errors.');
  });

  it('search for a shipping category', () => {
    cy.clickInFirst('a[href="/admin/shipping-categories/"]');
    cy.get('[id="criteria_search_type"]').select('contains');
    cy.get('[id="criteria_search_value"]').type(33);
    cy.get('*[class^="ui blue labeled icon button"]').click();
    cy.get('tbody').should('contain', '33');
  });

  it('search for a non-existing shipping category', () => {
    cy.clickInFirst('a[href="/admin/shipping-categories/"]');
    cy.get('[id="criteria_search_type"]').select('contains');
    cy.get('[id="criteria_search_value"]').type('55');
    cy.get('*[class^="ui blue labeled icon button"]').click();
  
    cy.get('body').should('contain', 'There are no results to display');
  });

  it('search for an empty shipping category', () => {
    cy.clickInFirst('a[href="/admin/shipping-categories/"]');
    cy.get('[id="criteria_search_type"]').select('contains');
    cy.get('[id="criteria_search_value"]').type('{selectall}{backspace}');
    cy.get('*[class^="ui blue labeled icon button"]').click();
  
    cy.get('tbody').should('not.contain', 'tr'); 
  });

  it('check if a category that is created not exist', () => {
    cy.clickInFirst('a[href="/admin/shipping-categories/"]');
    cy.get('[id="criteria_search_type"]').select('not_equal');
    cy.get('[id="criteria_search_value"]').type('33');
    cy.get('*[class^="ui blue labeled icon button"]').click();
  
    cy.get('body').should('contain', 'There are no results to display');
  });

  it('check if a category that is created, exist', () => {
    cy.clickInFirst('a[href="/admin/shipping-categories/"]');
    cy.get('[id="criteria_search_type"]').select('equal');
    cy.get('[id="criteria_search_value"]').type('33');
    cy.get('*[class^="ui blue labeled icon button"]').click();
  
    cy.get('tbody').should('contain', '33');
  });
  
  it('check if a category name starts with a char', () => {
    cy.clickInFirst('a[href="/admin/shipping-categories/"]');
    cy.get('[id="criteria_search_type"]').select('starts_with');
    cy.get('[id="criteria_search_value"]').type('3');
    cy.get('*[class^="ui blue labeled icon button"]').click();
  
    cy.get('tbody').should('contain', '33');
  });

  

  it('edit a shipping category name', () => {
    cy.clickInFirst('a[href="/admin/shipping-categories/"]');
    cy.get('[id="criteria_search_type"]').select('contains');
    cy.get('[id="criteria_search_value"]').type(33);
    cy.get('*[class^="ui blue labeled icon button"]').click();

    cy.get('body > div.admin-layout.admin-layout--open > div.admin-layout__body > div.admin-layout__content > div.sylius-grid-wrapper > div.ui.segment.spaceless.sylius-grid-table-wrapper > table > tbody > tr > td:nth-child(6) > div > a').click();
    cy.get('[id="sylius_shipping_category_name"]').type('44');
    cy.get('[id="sylius_save_changes_button"]').click();

    cy.get('body').should('contain', 'Shipping category has been successfully updated.');
  });
  

  it('delete a category', () => {
    cy.clickInFirst('a[href="/admin/shipping-categories/"]');
    cy.get('[id="criteria_search_type"]').select('contains');
    cy.get('[id="criteria_search_value"]').type(33);
    cy.get('*[class^="ui blue labeled icon button"]').click();

    cy.get('div.admin-layout.admin-layout--open div.admin-layout__body div.admin-layout__content div.sylius-grid-wrapper div.ui.segment.spaceless.sylius-grid-table-wrapper table tbody tr td:nth-child(6) > div > form > button').click();
    cy.get('[id="confirmation-button"]').click();

    cy.get('body').should('contain', 'Shipping category has been successfully deleted.');

  });

  // Implement the remaining test cases in a similar manner
});