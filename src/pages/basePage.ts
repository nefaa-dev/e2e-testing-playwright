import { expect, Locator, Page } from "@playwright/test";
import config from "../../playwright.config";

type Options =
  | { elementSelector: string; elementLocator?: never }
  | { elementSelector?: never; elementLocator: Locator };

type state = "visible" | "detached" | "attached" | "hidden";
export class BasePage {
  protected page: Page;
  public baseURL: string;
  protected baseApiURL: string;
  protected timeout: number;
  protected elementStates: any;

  constructor(page: Page) {
    this.page = page;
    this.baseURL = config.use?.baseURL ?? "localhost:80";
    this.timeout = config.expect?.timeout! / 8; // 30 sec
    this.baseApiURL = `${this.baseURL.replace("https://", "https://api.")}`;
    this.elementStates = {
      visible: "visible",
      detached: "detached",
      attached: "attached",
      hidden: "hidden",
      checked: "checked",
      unchecked: "unchecked",
    };
  }

  async goTo(url: string = `${this.baseURL}/`): Promise<void> {
    await this.page.goto(url);
    await this.WaitForRedirection(url);
  }

  async WaitForRedirection(url: string): Promise<void> {
    await this.page.waitForURL(url, { timeout: this.timeout });
    await expect(this.page).toHaveURL(url, { timeout: this.timeout });
  }

  async getNbrOfLocators(
    elementSelector: string,
    elementLocator?: Locator
  ): Promise<number> {
    if (elementLocator) {
      return await elementLocator.locator(elementSelector).count();
    }

    return await this.page.locator(elementSelector).count();
  }

  async getLocator(
    elementSelector: string,
    elementLocator?: Locator
  ): Promise<Locator> {
    if (elementLocator) {
      return elementLocator.locator(elementSelector);
    }
    return this.page.locator(elementSelector);
  }

  async getLocators(
    elementSelector: string,
    elementLocator?: Locator
  ): Promise<Locator[]> {
    if (elementLocator) {
      return elementLocator.locator(elementSelector).all();
    }
    return this.page.locator(elementSelector).all();
  }

  async toHaveValue(elementSelector: string, value: any): Promise<void> {
    await this.waitForSelectorToBe({ selector: elementSelector });
    await expect(this.page.locator(elementSelector)).toHaveValue(value, {
      timeout: this.timeout,
    });
  }

  async toNotHaveValue(elementSelector: string, value: any): Promise<void> {
    await this.waitForSelectorToBe({ selector: elementSelector });
    await expect(this.page.locator(elementSelector)).not.toHaveValue(value, {
      timeout: this.timeout,
    });
  }

  async toContainText(elementSelector: string, value: any): Promise<void> {
    let elementLocator = await this.waitForSelectorToBe({
      selector: elementSelector,
    });
    await expect(elementLocator).toContainText(value, {
      timeout: this.timeout,
    });
  }

  async toHaveCSS(
    elementSelector: string,
    property: any,
    value: any
  ): Promise<void> {
    let elementLocator = await this.waitForSelectorToBe({
      selector: elementSelector,
    });
    await expect(elementLocator).toHaveCSS(property, value, {
      timeout: this.timeout,
    });
  }

  async toHaveClass(elementSelector: string, value: any): Promise<void> {
    let elementLocator = await this.waitForSelectorToBe({
      selector: elementSelector,
    });
    await expect(elementLocator).toHaveClass(value, { timeout: this.timeout });
  }

  async toHaveText(value: string, options: Options): Promise<void> {
    if (options.elementSelector) {
      let elementLocator = await this.waitForSelectorToBe({
        selector: options.elementSelector,
      });
      await expect(elementLocator).toHaveText(value, { timeout: this.timeout });
    } else if (options.elementLocator) {
      await expect(options.elementLocator).toHaveText(value, {
        timeout: this.timeout,
      });
    } else {
      throw new Error("One of the two optional arguments should be provided.");
    }
  }

  async click(
    elementSelector: string,
    timeout: number = this.timeout
  ): Promise<void> {
    let elementLocator = await this.waitForSelectorToBe({
      selector: elementSelector,
      timeout: timeout,
    });
    await elementLocator.click();
  }

  async uncheck(elementSelector: string): Promise<void> {
    let elementLocator = await this.waitForSelectorToBe({
      selector: elementSelector,
    });
    await elementLocator.uncheck();
  }

  async fill(elementSelector: string, value: string): Promise<void> {
    let elementLocator = await this.waitForSelectorToBe({
      selector: elementSelector,
    });
    await elementLocator.fill(value);
  }

  async select(elementSelector: string, optionValue: any): Promise<void> {
    await this.waitForSelectorToBe({ selector: elementSelector });
    if (typeof optionValue === "number") {
      await this.page
        .locator(elementSelector)
        .selectOption({ index: optionValue });
    } else {
      await this.page
        .locator(elementSelector)
        .selectOption({ value: optionValue });
    }
  }

  async elementShouldBe(
    elementSelector: string,
    selectorStatus: state = "visible",
    baseElementLocator?: Locator
  ): Promise<void> {
    const elementLocator: Locator =
      baseElementLocator === undefined
        ? this.page.locator(elementSelector)
        : baseElementLocator.locator(elementSelector);
    switch (selectorStatus) {
      case this.elementStates.hidden:
        await expect(elementLocator).toBeHidden();
        break;
      case this.elementStates.checked:
        await expect(elementLocator).toBeChecked();
        break;
      case this.elementStates.unchecked:
        await expect(elementLocator).not.toBeChecked();
        break;
    }
  }
  async waitForSelectorToBe({
    selector,
    status = "visible",
    locator = null,
    timeout = this.timeout,
  }: {
    selector: string;
    status?: state;
    locator?: Locator | null;
    timeout?: number;
  }): Promise<Locator> {
    try {
      if (locator) {
        let newElementLocator = locator.locator(selector);
        await newElementLocator.waitFor({
          state: status,
          timeout: timeout,
        });
        return newElementLocator;
      }

      locator = this.page.locator(selector);
      await locator.waitFor({
        state: status,
        timeout: timeout,
      });
      return locator;
    } catch (error) {
      console.error(`Error while waiting for element to be ${status}: `, error);
      return locator!;
    }
  }

  async waitForSelectorNotToBeVisible(elementSelector: string): Promise<void> {
    await expect(this.page.locator(elementSelector)).not.toBeVisible({
      timeout: this.timeout,
    });
  }

  async waitForResponse(url: string): Promise<void> {
    await this.page.waitForResponse(url);
  }

  async isEnabled(status: boolean, elementSelector: string): Promise<void> {
    const elementLocator = this.page.locator(elementSelector);
    status
      ? await expect(elementLocator).toBeEnabled()
      : await expect(elementLocator).not.toBeEnabled();
  }

  async isChecked(elementSelector: string): Promise<boolean> {
    let checkboxLocator = await this.waitForSelectorToBe({
      selector: elementSelector,
    });
    return await checkboxLocator.isChecked();
  }

  async assertCheckBoxStatus(
    elementSelector: string,
    expectedStatus: boolean
  ): Promise<void> {
    try {
      let checkboxLocator = await this.waitForSelectorToBe({
        selector: elementSelector,
      });
      expect(await checkboxLocator.isChecked()).toBe(expectedStatus);
    } catch (error) {
      console.error("Error occured while verifying checkbox status: ", error);
    }
  }

  async waitForSelectorToBeFocused(elementSelector: string): Promise<void> {
    await expect(this.page.locator(elementSelector)).toBeFocused({
      timeout: this.timeout,
    });
  }

  async reloadPage() {
    await this.page.reload();
  }

  async retryUntilExpectationPasses(
    expectation: () => Promise<void>,
    maxAttempts: number,
    delayMs: number
  ): Promise<void> {
    let attempts: number = 0;
    let error: Error | undefined;
    while (attempts < maxAttempts) {
      try {
        await expectation();
        return; // Expectation passed, exit the loop
      } catch (e) {
        error = e as Error;
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs)); // Wait for the specified delay
      attempts++;
    }
    throw error; // Expectation failed even after retries, throw the last error
  }

  async assertLocatorsNbr(
    expectedCount: number,
    elementSelector: string,
    elementLocator?: Locator
  ): Promise<void> {
    let count = await this.getNbrOfLocators(elementSelector, elementLocator);
    expect(count).toEqual(expectedCount);
  }

  async setInputFiles(
    elementSelector: string,
    filePath: string
  ): Promise<void> {
    const fileChooserPromise = this.page.waitForEvent("filechooser");
    let fileUploadLabel = await this.waitForSelectorToBe({
      selector: elementSelector,
    });
    await fileUploadLabel.click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(filePath);
  }
}
