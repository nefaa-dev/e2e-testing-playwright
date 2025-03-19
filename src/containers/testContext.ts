import {
  Browser,
  BrowserContext,
  Page,
  chromium,
  firefox,
  webkit,
} from "@playwright/test";
import { Container, ContainerKeys } from "./container";

const isCI = process.env.CI === "true"; // Check if running on CI
interface TestContext {
  browserLaunch(): Promise<Browser>;
  newPage(browser: Browser, scenarioName?: string): Promise<Page>;
  close(): Promise<void>;
}

export class BrowserTestContext implements TestContext {
  async browserLaunch(browserName: string = "chromium"): Promise<Browser> {
    let browser: Browser;
    switch (browserName) {
      case "chromium":
        browser = await chromium.launch({ headless: isCI });

        break;
      case "firefox":
        browser = await firefox.launch({ headless: isCI });
        break;
      case "webkit":
        browser = await webkit.launch({ headless: isCI });
        break;
      default:
        throw new Error(`Unsupported browser: ${browserName}`);
    }
    Container.register(ContainerKeys.browser, browser);

    return browser!;
  }

  private async initContext(
    browser: Browser,
    scenarioName: any
  ): Promise<BrowserContext> {
    let context = await browser.newContext({
      ignoreHTTPSErrors: true,
      recordVideo: {
        dir: `./artifacts/videos/${scenarioName}`,
      },
      recordHar: {
        path: `./artifacts/har/${scenarioName}`,
        content: "embed",
      },
    });

    Container.register(ContainerKeys.context, context);
    return context;
  }

  async newPage(browser: Browser, scenarioName?: string): Promise<Page> {
    let page: Page;
    if (scenarioName !== "undefined") {
      let context = await this.initContext(browser, scenarioName);
      page = await context.newPage();
    } else {
      page = await browser.newPage();
    }

    Container.register(ContainerKeys.page, page);
    return page;
  }
  async close(): Promise<void> {
    await this.kill(ContainerKeys.page);
    await this.kill(ContainerKeys.context);
    await this.kill(ContainerKeys.browser);
  }

  async kill(resource: keyof typeof ContainerKeys): Promise<void> {
    try {
      if (Container.isRegistered(resource)) {
        console.log(`Closing resource: ${resource}`);
        const resourceObj: any = Container.resolve(resource);

        if (resourceObj) {
          await resourceObj.close();
          console.log(`Resource ${resource} closed successfully.`);
        }
      }
    } catch (error) {
      console.error(`Error during closing resource ${resource}:`, error);
    }
  }
}
