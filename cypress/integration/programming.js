describe("Can compile a simple program", () => {
  it("loads", () => {
    cy.server();
    cy.route("GET", "/myself", "fixture:myself.json").as("myself");

    cy.visit("/");

    cy.wait("@myself").then((xhr) => {
      assert.equal(xhr.status, 200);
    });
  });
  it("can compile a 'pass-instruction'", () => {
    cy.server();
    cy.route("GET", "/myself", "fixture:myself.json");
    cy.route("GET", "/script/my_scripts", []);
    cy.route("POST", "/script/compile").as("compile");

    cy.visit("/#/programming");
    cy.get("[id=schema-node-Pass]").click();
    cy.wait("@compile");
    cy.get("[id=compilation-result]").should(
      "contain",
      "Compiled successfully"
    );
  });
});
