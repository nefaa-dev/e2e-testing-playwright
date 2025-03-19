import { When, Then } from "@cucumber/cucumber";
import { SequencePage } from "../../pages/sequencePage";
import { Container, ContainerKeys } from "../../containers/container";

let sequencePage!: SequencePage;

When("User Click On Validate Button", async function () {
  sequencePage = Container.resolve(ContainerKeys.sequencePage);
  await sequencePage.validate();
});

When("User Wait For Validating State To Be Completed", async function () {
  await sequencePage.waitForValidation();
});

Then(
  "User Should Get The Validation Results Table For All Sequences",
  async function () {
    await sequencePage.getResults();
  }
);

Then(
  "Results Should Be As {string} For The Selected {string}",
  async function (expectedResults: string, vendors: string) {
    let vendorsList = vendors.split(",").map((v) => v.trim().toLowerCase());
    await sequencePage.checkResults(expectedResults, vendorsList);
  }
);
