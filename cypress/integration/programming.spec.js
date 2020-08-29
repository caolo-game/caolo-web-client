describe("Can compile a simple program", () => {
  it("can compile a 'pass-instruction'", () => {
    cy.server();
    cy.route("GET", "/myself", "fixture:myself.json");
    cy.route("GET", "/scripts", []);
    cy.route("POST", "/script/compile").as("compile");

    cy.visit("/#/programming");
    cy.get("[id=schema-node-Pass]").click();
    cy.get("[id=compilation-result]").should(
      "contain",
      "Compiled successfully"
    );
  });

  it("can create a looping program", () => {
    cy.server();
    cy.route("GET", "/myself", "fixture:myself.json");
    cy.route("GET", "/scripts", []);
    cy.route("POST", "/script/compile").as("compile");

    cy.visit("/#/programming");

    cy.get("[id=schema-node-ScalarInt]").click();
    cy.get("[id=program_node_0]").within(() => {
      cy.get("input").type("4");
    });
    cy.get("[id=schema-node-SetVar]").click();
    cy.get("[id=program_node_1]").within(() => {
      cy.get("input").type("i");
    });
    cy.get("[id=schema-node-StringLiteral]").click();
    cy.get("[id=program_node_2]").within(() => {
      cy.get("input").type("Ye boiiiiii");
    });
    cy.get("[id=schema-node-console_log]").click();
    cy.get("[id=schema-node-ReadVar]").click();
    cy.get("[id=program_node_4]").within(() => {
      cy.get("input").type("i");
    });
    cy.get("[id=schema-node-ScalarInt]").click();
    cy.get("[id=program_node_5]").within(() => {
      cy.get("input").type("1");
    });
    cy.get("[id=schema-node-Sub]").click();
    cy.get("[id=schema-node-SetVar]").click();
    cy.get("[id=program_node_7]").within(() => {
      cy.get("input").type("i");
    });
    cy.get("[id=schema-node-ReadVar]").click();
    cy.get("[id=program_node_8]").within(() => {
      cy.get("input").type("i");
    });
    cy.get("[id=schema-node-JumpIfTrue]").click();
    cy.get("[id=program_node_9]").within(() => {
      cy.get("input").type("2");
    });

    cy.get("[id=compilation-result]").should(
      "contain",
      "Compiled successfully"
    );
  });
});
