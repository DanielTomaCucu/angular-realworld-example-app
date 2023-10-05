/// <reference types="cypress" />

describe("Test 1", () => {
  beforeEach("login", () => {
    cy.intercept(
      { method: "GET", path: "tags" },
      {
        fixture: "tags.json",
      }
    );
    cy.loginToApp();
  });
  it("should verify the article is addeed", () => {
    cy.intercept("POST", "https://api.realworld.io/api/articles/").as(
      "postArticle"
    );
    cy.contains("New Article").click();
    cy.get('[placeholder="Article Title"]').type("test 00000");
    cy.get('[formcontrolname="description"]').type("test cy");
    cy.get("textarea").type("test test test");
    cy.contains(" Publish Article").click();

    cy.wait("@postArticle");
    cy.get("@postArticle").then((xhr) => {
      console.log(xhr);
      expect(xhr.response.statusCode).to.equal(201);
      expect(xhr.response.body.article.body).to.equal("test test test");
      expect(xhr.response.body.article.description).to.equal("test cy");
    });
  });

  it("verify if tags are displayed correctly", () => {
    cy.get(".tag-list")
      .should("contain", "welcome")
      .and("contain", "cypress")
      .and("contain", "testing");
  });

  it.only("verify global feed", () => {
    cy.intercept("GET", Cypress.env('apiUrl')+ "/api/articles/feed*", {
      articles: [],
      articlesCount: 0,
    });
    cy.intercept("GET", Cypress.env("apiUrl") +  "/api/articles*", {
      fixture: "articles.json",
    });
    cy.contains("Global Feed").click();
    cy.get("app-article-list button").then((heartBtn) => {
      expect(heartBtn[0]).to.contain("1");
      expect(heartBtn[1]).to.contain("0");
    });

    cy.fixture("articles").then((file) => {
      const artlink = file.articles.slug;
      file.articles[1].favoritesCount = 1;
      cy.intercept(
        "POST",
        Cypress.env("apiUrl") +  "/api/articles/" + artlink + "/favorite",
        file
      );
    });
    cy.get("app-article-list button").eq(1).click().should("contain", "1");
  });

  it("should verify the article is addeed", () => {
    cy.intercept("POST", "**/articles", (req) => {
      req.body.article.description = "This is a desc 1";
    }).as("postArticle");
    cy.contains("New Article").click();
    cy.get('[placeholder="Article Title"]').type("test 001000");
    cy.get('[formcontrolname="description"]').type("test cy");
    cy.get("textarea").type("test test test");
    cy.contains(" Publish Article").click();

    cy.wait("@postArticle");
    cy.get("@postArticle").then((xhr) => {
      console.log(xhr);
      expect(xhr.response.statusCode).to.equal(201);
      expect(xhr.response.body.article.body).to.equal("test test test");
      expect(xhr.response.body.article.description).to.equal(
        "This is a desc 1"
      );
    });
  });
  it("delete an article in a global feed", () => {
    const user = {
      user: {
        email: Cypress.env('userName'),
        password: Cypress.env('password'),
      },
    };

    const artBody = {
      article: {
        body: "ttt",
        description: "ttt",
        tagList: [],
        title: "ttt",
      },
    };
    cy.request("POST", Cypress.env('apiUrl') + "/api/users/login", user)
      .its("body")
      .then((body) => {
        const token = body.user.token;
        cy.request({
          url: "https://api.realworld.io/api/articles/",
          headers: { "Authorization": "Token " + token },
          method: "POST",
          body: artBody,
        }).then((response) => {
          expect(response.status).to.equal(200);
        });
      });
  });
});
