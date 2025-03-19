import { Page } from "@playwright/test";
import { BasePage } from "./basePage";

const selectors = {
  eurofinsCheckbox: '[data-testid="checkbox-eurofins"]',
  idtdnacCheckbox: '[data-testid="checkbox-idtdna"]',
  twistdnaCheckbox: '[data-testid="checkbox-twistdna"]',
  thermofisherCheckbox: '[data-testid="checkbox-thermofisher"]',
  biontechCheckbox: '[data-testid="checkbox-biontech"]',
  lowScoringToggle: '[data-testid="lowScoringMatrix-switch"]',
  vectorDropDown: '[data-testid="select-vendor=twistdna-parameter=vector"]',
  insertionDropDown:
    '[data-testid="select-vendor=twistdna-parameter=insertion"]',
};

export class VendorPage extends BasePage {
  private readonly vendors: string[];
  private readonly vendorsArgs: any;
  private readonly constructTypeTimeout: number;
  constructor(page: Page) {
    super(page);
    this.constructTypeTimeout = this.timeout * 3;
    this.vendors = [
      "eurofins",
      "idtdna",
      "twistdna",
      "thermofisher",
      "biontech",
    ];
    this.vendorsArgs = {
      consTypeApp: {
        eurofins: false,
        idtdna: false,
        twistdna: true,
        thermofisher: false,
        biontech: true,
      },
      lowScoringMatrix: ["twistdna"],
    };
  }

  async checkAllSelection(): Promise<void> {
    const vendorsSelectors = [
      selectors.eurofinsCheckbox,
      selectors.idtdnacCheckbox,
      selectors.twistdnaCheckbox,
      selectors.thermofisherCheckbox,
      selectors.biontechCheckbox,
    ];
    const expectedStatus = true;
    for (let vendorSelector of vendorsSelectors) {
      await this.assertCheckBoxStatus(vendorSelector, expectedStatus);
    }
  }

  async checkLowScoringMatrix(status: string): Promise<void> {
    if (status) {
      const state =
        status === "true"
          ? this.elementStates.checked
          : this.elementStates.unchecked;
      await this.elementShouldBe(selectors.lowScoringToggle, state);
    }
  }

  async keepOnly(vendors: string[]): Promise<void> {
    const vendorsToUnselect = this.vendors.filter(
      (vendor) => !vendors.map((v) => v.trim().toLowerCase()).includes(vendor)
    );
    for (let vendor of vendorsToUnselect) {
      switch (vendor) {
        case "eurofins":
          await this.uncheck(selectors.eurofinsCheckbox);
          break;
        case "idtdna":
          await this.uncheck(selectors.idtdnacCheckbox);
          break;
        case "twistdna":
          await this.uncheck(selectors.twistdnaCheckbox);
          break;
        case "thermofisher":
          await this.uncheck(selectors.thermofisherCheckbox);
          break;
        case "biontech":
          await this.uncheck(selectors.biontechCheckbox);
          break;
        default:
          console.log(
            "The vendor is not recognised, please recheck for misspelling!"
          );
      }
    }
  }

  async isSelected(vendor: string): Promise<boolean> {
    const selector = `[data-testid="checkbox-${vendor}"]`;
    return await this.isChecked(selector);
  }

  async selectConstructType(
    constructType: string,
    vendor: string
  ): Promise<void> {
    if (
      (await this.isSelected(vendor)) &&
      this.vendorsArgs.consTypeApp[vendor]
    ) {
      const dropDownSelector = `[data-testid="select-vendor=${vendor}-parameter=constructType"]`;
      await this.click(dropDownSelector, this.constructTypeTimeout);

      const option = `[data-testid="select-vendor=${vendor}-parameter=constructType-option=${constructType}"]`;
      await this.click(option, this.constructTypeTimeout);
    }
  }

  async setConstructTypes(
    constructTypes: string[],
    vendors: string[]
  ): Promise<void> {
    let index = 0;
    for (let constructType of constructTypes) {
      switch (constructType.toLowerCase()) {
        case "cloned_gene":
          await this.selectConstructType("CLONED_GENE", vendors[index]);
          break;

        case "non_cloned_gene":
          await this.selectConstructType("NON_CLONED_GENE", vendors[index]);
          break;

        default:
          console.log(
            `The construct type is not applicable for ${vendors[index]}!`
          );
      }
      index++;
    }
  }

  async setLowScoringMatrix(status: string): Promise<void> {
    if (status) {
      status === "true"
        ? await this.click(selectors.lowScoringToggle)
        : await this.elementShouldBe(
            selectors.lowScoringToggle,
            this.elementStates.unchecked
          );
    }
  }

  async setVector(vector: string, vendors: string[]): Promise<void> {
    for (let vendor of vendors) {
      if (vendor === this.vendors[2]) {
        //twistDNA
        await this.click(selectors.vectorDropDown);
        const vectorOption = `[data-testid="select-vendor=twistdna-parameter=vector-option=${vector}"]`;
        await this.click(vectorOption);
        return;
      } else {
        console.log(`No Vectors For This vendor ${vendor}`);
      }
    }
  }

  async setInsertion(insertion: string, vendors: string[]) {
    for (let vendor of vendors) {
      if (vendor === this.vendors[2]) {
        // twistDNA
        await this.click(selectors.insertionDropDown);
        const insertionOption = `[data-testid="select-vendor=twistdna-parameter=insertion-option=${insertion}"]`;
        await this.click(insertionOption);
        return;
      } else {
        console.log(`No Insertions For This vendor ${vendor}`);
      }
    }
  }
}
