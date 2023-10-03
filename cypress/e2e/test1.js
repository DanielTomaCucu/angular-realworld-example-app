/// <reference types="cypress" />

describe("Test 1", () => {
  beforeEach('login', () => {
    cy.loginToApp()
  });
  it('should verify the article is addeed', () => {
    cy.intercept('POST','https://api.realworld.io/api/articles/').as('postArticle')
    cy.contains("New Article").click();
     cy.get('[placeholder="Article Title"]').type("test 00000");
    cy.get('[formcontrolname="description"]').type("test cy");
    cy.get("textarea").type('test test test');
    cy.contains(" Publish Article").click();

    cy.wait('@postArticle');
    cy.get('@postArticle').then(xhr => {
      console.log(xhr);
      expect(xhr.response.statusCode).to.equal(201);
      expect(xhr.response.body.article.body).to.equal('test test test');
      expect(xhr.response.body.article.description).to.equal("test cy");
    })
  })

});
