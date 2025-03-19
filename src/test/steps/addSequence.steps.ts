import { Given, When, Then } from "@cucumber/cucumber";
import { SequencePage } from "../../pages/sequencePage";
import { Container, ContainerKeys } from "../../containers/container";

let sequencePage!: SequencePage;

Given("Vendors Application Is Already Open", async function () {
  sequencePage = Container.resolve(ContainerKeys.sequencePage);
  await sequencePage.goTo();
});

When("User Fill In A Sequence {string}", async function (sequence: string) {
  await sequencePage.type(sequence);
});

When("User Click On Add Button", async function () {
  await sequencePage.clickOnAddButton();
});

Then("The sequence should be added", async function () {
  await sequencePage.check();
});

Then("The sequence should not be added", async function () {
  await sequencePage.shouldNotBeAdded();
});

Then(
  "Notification Should Be Displayed {string}",
  async function (message: string) {
    await sequencePage.isNotificationShown(message);
  }
);
