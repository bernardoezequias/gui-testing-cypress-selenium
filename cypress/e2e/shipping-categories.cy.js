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

  it('Search for a shipping category (33)', () => {
    cy.clickInFirst('a[href="/admin/shipping-categories/"]');
    cy.get('[id="criteria_search_type"]').select('contains');
    cy.get('[id="criteria_search_value"]').type(33);
    cy.get('*[class^="ui blue labeled icon button"]').click();
    cy.get('tbody').should('contain', '33')
  });

  it('Edit a shipping category name', () => {
    cy.clickInFirst('a[href="/admin/shipping-categories/"]');
    cy.get('[id="criteria_search_type"]').select('contains');
    cy.get('[id="criteria_search_value"]').type(33);
    cy.get('*[class^="ui blue labeled icon button"]').click();

    cy.get('a[href="/admin/shipping-categories/1/edit"]').click();
    cy.get('[id="sylius_shipping_category_name"]').type('44');
    cy.get('[id="sylius_save_changes_button"]').click();

    cy.get('body').should('contain', 'Shipping category has been successfully updated.');
  });

  // Implement the remaining test cases in a similar manner
});
