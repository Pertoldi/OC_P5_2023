/// <reference types="cypress" />
describe('register spec', () => {
  it('Register successfull', () => {

    cy.visit('/register');
    cy.url().should('include', '/register');

    cy.get('input[formControlName=firstName]').type('name');
    cy.get('input[formControlName=lastName]').type('mail');
    cy.get('input[formControlName=email]').type(
      `name${Date.now().toString()}@mail.com`
    );
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    )
  })
});
