import { When, Then } from "@cucumber/cucumber";
import { SequencePage } from "../../pages/sequencePage";
import { Container, ContainerKeys } from "../../containers/container";

let sequencePage!: SequencePage;

When("User Upload A File {string}", async function (filePath: string) {
  sequencePage = Container.resolve(ContainerKeys.sequencePage);
  await sequencePage.upload(filePath);
});

Then(
  "All Sequences In {string} Should Be Added",
  async function (filePath: string) {
    await sequencePage.parseFile(filePath);
    await sequencePage.check();
  }
);
