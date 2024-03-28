import { fa, faker } from "@faker-js/faker";
import post from "../fixtures/post.json";

describe("API spec", () => {
  it("Get all posts", () => {
    cy.request("/posts").then((response) => {
      expect(response.status).to.be.equal(200);
    });
  });

  it("Get 10 posts", () => {
    cy.request("/posts?_start=0&_limit=10").then((response) => {
      expect(response.status).to.be.equal(200);
      expect(response.body.length).to.be.equal(10);
    });
  });

  it("Get specified posts", () => {
    cy.request("/posts?id=55&id=60").then((response) => {
      expect(response.status).to.be.equal(200);
      expect(response.body.length).to.be.equal(2);
      expect(response.body[0].id).to.be.equal(55);
      expect(response.body[1].id).to.be.equal(60);
    });
  });

  it("Try to create a post", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:3000/664/posts",
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.be.equal(401);
    });
  });

  it("Create post with adding token", () => {
    let email = faker.internet.email();
    let password = faker.internet.password();
    let postId = faker.number.bigInt();
    let token;
    let UserId;

    // register
    cy.request({
      method: "POST",
      url: "http://localhost:3000/register",
      failOnStatusCode: false,
      body: {
        email: email,
        password: password,
      },
    }).then((response) => {
      expect(response.status).to.be.equal(201);
      token = response.body.accessToken;
      UserId = response.body.user.id;
      /* 
      // verify registered user exists?
      cy.request({
        method: "GET",
        url: `http://localhost:3000/600/users/${UserId}`,
        headers: { Authorization: `Bearer ${token}` },
      }).then((resp) => {
        expect(resp.status).to.be.equal(200);
      });
 */
      // login with newly registered user
      cy.request({
        method: "POST",
        url: "/login",
        body: {
          email: email,
          password: password,
        },
      }).then((response) => {
        expect(response.status).to.be.equal(200);
      });

      // create a post
      cy.request({
        method: "POST",
        url: "/posts",
        body: {
          id: `${postId}`,
          title: "a post title",
          body: "voluptatem qui placeat dolores qui velit aut",
          views: 666,
        },
      }).then((response) => {
        expect(response.status).to.be.equal(201);
      });
    });
  });

  it("Create a post using JSON body", () => {
    let email = faker.internet.email();
    let password = faker.internet.password();
    let postId = faker.number.bigInt();
    let token;
    let UserId;
    post.title = faker.lorem.sentence(3);
    post.body = faker.lorem.sentence(10);

    cy.request({
      method: "POST",
      url: "http://localhost:3000/register",
      failOnStatusCode: false,
      body: {
        email: email,
        password: password,
      },
    }).then((response) => {
      expect(response.status).to.be.equal(201);
      token = response.body.accessToken;
      UserId = response.body.user.id;

      cy.request({
        method: "POST",
        url: "/login",
        body: {
          email: email,
          password: password,
        },
      }).then((response) => {
        expect(response.status).to.be.equal(200);
      });

      cy.request({
        method: "POST",
        url: "/posts",
        body: {
          id: `${postId}`,
          title: `${post.title}`,
          body: `${post.body}`,
          views: 666,
        },
      }).then((response) => {
        expect(response.status).to.be.equal(201);
      });
    });
  });

  it("Update non-existing entity", () => {

    cy.request({
      method: "PATCH",
      url: "/posts/777",
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.be.equal(404);
    });
  });

  it("Create post entity and update the created entity", () => {
    let email = faker.internet.email();
    let password = faker.internet.password();
    let postId = faker.number.bigInt();
    let token;
    let UserId;
    post.title = faker.lorem.sentence(3);
    post.body = faker.lorem.sentence(10);

    cy.request({
      method: "POST",
      url: "http://localhost:3000/register",
      failOnStatusCode: false,
      body: {
        email: email,
        password: password,
      },
    }).then((response) => {
      expect(response.status).to.be.equal(201);
      token = response.body.accessToken;
      UserId = response.body.user.id;

      cy.request({
        method: "POST",
        url: "/login",
        body: {
          email: email,
          password: password,
        },
      }).then((response) => {
        expect(response.status).to.be.equal(200);
      });

      cy.request({
        method: "POST",
        url: "/posts",
        body: {
          id: `${postId}`,
          title: `${post.title}`,
          body: `${post.body}`,
          views: 666,
        },
      }).then((response) => {
        expect(response.status).to.be.equal(201);
      });
    });

      cy.request({
        method: "PATCH",
        url: `/posts/${postId}`,
        body: { 
          body: `UPDATED POST - ${post.body}`
        }
      }).then((response) => {
        expect(response.status).to.be.equal(200);
      });

      cy.request({
        method: "GET",
        url: `/posts/${postId}`
      }).then((response) => {
        expect(response.status).to.be.equal(200);
        expect(response.body.body).to.be.equal(`UPDATED POST - ${post.body}`);
      });
  });

  it("Delete non-existing post entity", () => {

    cy.request({
      method: "DELETE",
      url: "/posts/777",
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.be.equal(404);
    });
  });

  it("Create post entity, update the created entity, and delete the entity", () => {
    let email = faker.internet.email();
    let password = faker.internet.password();
    let postId = faker.number.bigInt();
    let token;
    let UserId;
    post.title = faker.lorem.sentence(3);
    post.body = faker.lorem.sentence(10);

    cy.request({
      method: "POST",
      url: "http://localhost:3000/register",
      failOnStatusCode: false,
      body: {
        email: email,
        password: password,
      },
    }).then((response) => {
      expect(response.status).to.be.equal(201);
      token = response.body.accessToken;
      UserId = response.body.user.id;

      cy.request({
        method: "POST",
        url: "/login",
        body: {
          email: email,
          password: password,
        },
      }).then((response) => {
        expect(response.status).to.be.equal(200);
      });

      cy.request({
        method: "POST",
        url: "/posts",
        body: {
          id: `${postId}`,
          title: `${post.title}`,
          body: `${post.body}`,
          views: 666,
        },
      }).then((response) => {
        expect(response.status).to.be.equal(201);
      });
    });

      cy.request({
        method: "PATCH",
        url: `/posts/${postId}`,
        body: { 
          body: `UPDATED POST - ${post.body}`
        }
      }).then((response) => {
        expect(response.status).to.be.equal(200);
      });

      cy.request({
        method: "DELETE",
        url:`/posts/${postId}`
      }).then((response) => {
        expect(response.status).to.be.equal(200);
      });

      cy.request({
        method: "GET",
        url: `/posts/${postId}`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.equal(404);
      });

  });

});
