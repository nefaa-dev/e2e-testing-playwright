import { When, Then } from "@cucumber/cucumber";
import { SequencePage } from "../../pages/sequencePage";
import { Container, ContainerKeys } from "../../containers/container";

let sequencePage!: SequencePage;

When("User Click On Delete Button", async function () {
  sequencePage = Container.resolve(ContainerKeys.sequencePage);
  await sequencePage.delete();
});

Then("Sequence Should Be Deleted", async function () {
  await sequencePage.shouldBeDeleted();
});

Then("No Results Table Should Be Displayed", async function () {
  await sequencePage.checkResultsVisibility();
});
