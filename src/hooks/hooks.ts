import { Browser, Page } from "@playwright/test";
import { Before, After, setDefaultTimeout } from "@cucumber/cucumber";
import { captureScreenshots } from "../helper/tools";
import { SequencePage } from "../pages/sequencePage";
import { BrowserTestContext } from "../containers/testContext";
import { Container, ContainerKeys } from "../containers/container";
import config from "../../playwright.config";
import { VendorPage } from "../pages/vendorPage";

export const globalTimeout: number = config.expect?.timeout!;
setDefaultTimeout(globalTimeout);

let browser: Browser;
let page: Page;
let testContext: BrowserTestContext;

Before(async (scenario: any) => {
  testContext = new BrowserTestContext();
  browser = await testContext.browserLaunch();
  page = await testContext.newPage(browser, scenario.pickle.name);

  let sequencePage: SequencePage = new SequencePage(page);
  let vendorPage: VendorPage = new VendorPage(page);
  Container.register(ContainerKeys.sequencePage, sequencePage);
  Container.register(ContainerKeys.vendorPage, vendorPage);
});

After(async function (scenario: any) {
  await captureScreenshots(scenario, page);
  await testContext.close();
});
