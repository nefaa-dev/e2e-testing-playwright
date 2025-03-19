import { Given, When } from "@cucumber/cucumber";
import { Container, ContainerKeys } from "../../containers/container";
import { VendorPage } from "../../pages/vendorPage";

let vendorPage!: VendorPage;
Given("All Vendors Are Selected By Default", async function () {
  vendorPage = Container.resolve(ContainerKeys.vendorPage);
  await vendorPage.checkAllSelection();
});

Given(
  "Low Scoring Matrix Status Should Be {string}",
  async function (lowScoringStatus: string) {
    await vendorPage.checkLowScoringMatrix(lowScoringStatus.toLowerCase());
  }
);

When(
  "User Keep Only {string} Selected As Vendors",
  async function (vendors: string) {
    vendorPage = Container.resolve(ContainerKeys.vendorPage);
    await vendorPage.keepOnly(vendors.trim().split(","));
  }
);

When(
  "User Set {string} For {string} If Applicable",
  async function (constructTypes: string, vendors: string) {
    let vendorsList = vendors.split(",").map((v) => v.trim().toLowerCase());
    let typesList = constructTypes
      .split(",")
      .map((v) => v.trim().toLowerCase());

    await vendorPage.setConstructTypes(typesList, vendorsList);
  }
);

When(
  "User Set {string} If Applicable",
  async function (lowScoringMatrix: string) {
    await vendorPage.setLowScoringMatrix(lowScoringMatrix.toLowerCase());
  }
);


When(
  "User Set {string} And {string} For {string} When Applicable",
  async function (vector: string, insertion:string, vendors:string) {
    let vendorsList = vendors.split(",").map(v => v.trim().toLowerCase());
    await vendorPage.setVector(vector, vendorsList);
    await vendorPage.setInsertion(insertion, vendorsList);
  }
);





