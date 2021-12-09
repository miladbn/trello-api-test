/// <reference types="Cypress" />

describe("Objective 1", () => {
  it("Test", () => {
    cy.request({
      // create a boards
      method: "POST",
      url: "https://api.trello.com/1/boards/?key=d562030c08d88122ffa1f28f7a157456&token=d8dfc25cbef8398067b484cb9df7780667881bcb092290e8fb95802c405166d5&name=newtest",
    }).then((response) => {
      const boardId = response.body.id;
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("id");
      expect(response.body).to.have.property("name");
      expect(response.body).to.have.property("url");
      cy.request({
        // get boards
        method: "GET",
        url: `https://api.trello.com/1/boards/${boardId}/lists?key=d562030c08d88122ffa1f28f7a157456&token=d8dfc25cbef8398067b484cb9df7780667881bcb092290e8fb95802c405166d5`,
      }).then((response) => {
        const listId = response.body[0].id;
        const DoneListId = response.body[1].id;
        expect(response.status).to.eq(200);
        expect(response.body[0]).to.have.property("id");
        expect(response.body[0]).to.have.property("name");
        cy.request({
          // add first card in board
          method: "POST",
          url: `https://api.trello.com/1/cards?key=d562030c08d88122ffa1f28f7a157456&token=d8dfc25cbef8398067b484cb9df7780667881bcb092290e8fb95802c405166d5&name=test1&idList=${listId}`,
        }).then((response) => {
          expect(response.status).to.eq(200);
          const firstCardId = response.body.id;
          expect(response.body).to.have.property("id");
          expect(response.body).to.have.property("name");
          expect(response.body).to.have.property("url");
          cy.request({
            // delete card in boards
            method: "DELETE",
            url: `https://api.trello.com/1/cards/${firstCardId}?key=d562030c08d88122ffa1f28f7a157456&token=d8dfc25cbef8398067b484cb9df7780667881bcb092290e8fb95802c405166d5`,
          }).then((response) => {
            expect(response.status).to.eq(200);
            cy.request({
              // create second card
              method: "POST",
              url: `https://api.trello.com/1/cards?key=d562030c08d88122ffa1f28f7a157456&token=d8dfc25cbef8398067b484cb9df7780667881bcb092290e8fb95802c405166d5&name=test2&idList=${listId}`,
            }).then((response) => {
              expect(response.status).to.eq(200);
              const secondCardId = response.body.id;
              expect(response.body).to.have.property("id");
              expect(response.body).to.have.property("name");
              expect(response.body).to.have.property("url");
              cy.request({
                // update the card that create
                method: "PUT",
                url: `https://api.trello.com/1/cards/${secondCardId}?key=d562030c08d88122ffa1f28f7a157456&token=d8dfc25cbef8398067b484cb9df7780667881bcb092290e8fb95802c405166d5&name=bottom`,
              }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.have.property("id");
                expect(response.body).to.have.property("name");
                expect(response.body).to.have.property("url");
              });
            });
            cy.request({
              // create third card
              method: "POST",
              url: `https://api.trello.com/1/cards?key=d562030c08d88122ffa1f28f7a157456&token=d8dfc25cbef8398067b484cb9df7780667881bcb092290e8fb95802c405166d5&name=test3&idList=${listId}`,
            }).then((response) => {
              expect(response.status).to.eq(200);
              const thirdCardId = response.body.id;
              expect(response.body).to.have.property("id");
              expect(response.body).to.have.property("name");
              expect(response.body).to.have.property("url");
              cy.request({
                // add comment to card
                method: "POST",
                url: `https://api.trello.com/1/cards/${thirdCardId}/actions/comments?text=thisIsTestText/&key=d562030c08d88122ffa1f28f7a157456&token=d8dfc25cbef8398067b484cb9df7780667881bcb092290e8fb95802c405166d5`,
              }).then((response) => {
                expect(response.status).to.eq(200);
              });
              cy.request({
                method: "GET",
                url: `https://api.trello.com/1/lists/${listId}/cards/?key=d562030c08d88122ffa1f28f7a157456&token=d8dfc25cbef8398067b484cb9df7780667881bcb092290e8fb95802c405166d5`,
              }).then((response) => {
                // Verify that there are 2 cards on the board
                expect(response.status).to.eq(200);
                expect(response.body).has.length(2);
              });
              cy.request({
                // Verify that there is a card with a comment
                method: "GET",
                url: `https://api.trello.com/1/cards/${thirdCardId}/actions/?key=d562030c08d88122ffa1f28f7a157456&token=d8dfc25cbef8398067b484cb9df7780667881bcb092290e8fb95802c405166d5`,
              }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).has.length(1);
                expect(response.body[0]).to.have.property(
                  "type",
                  "commentCard"
                );
              });
              cy.request({
                // add comment to card
                method: "POST",
                url: `https://api.trello.com/1/cards/${thirdCardId}/actions/comments?text=newText/&key=d562030c08d88122ffa1f28f7a157456&token=d8dfc25cbef8398067b484cb9df7780667881bcb092290e8fb95802c405166d5`,
              }).then((response) => {
                expect(response.status).to.eq(200);
              });
            });
          });
        });
      });

      cy.request({
        // delete board
        method: "DELETE",
        url: `https://api.trello.com/1/boards/${boardId}/?key=d562030c08d88122ffa1f28f7a157456&token=d8dfc25cbef8398067b484cb9df7780667881bcb092290e8fb95802c405166d5`,
      }).then((response) => {
        expect(response.status).to.eq(200);
      });
    });
  });
});
