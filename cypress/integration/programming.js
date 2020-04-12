describe("Can compile a simple program", () => {
  it("loads", () => {
    cy.visit("/");
  });
  it("navigates to programming", () => {
    cy.get("a[id=programming-link]").click();
  });
  it("can compile a 'pass-instruction'", () => {
    cy.get("[id=schema-node-Pass]").click();
  });
  it("compiles successfully", () => {
    let result = cy.get("[id=compilation-result]");
    result.should('contain', "Compiled successfully")
  });
});
