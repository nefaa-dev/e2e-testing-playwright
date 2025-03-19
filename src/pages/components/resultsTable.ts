import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "../basePage";

type header = {
  columnsCount: number;
  rowsCount: number;
  columnsNames: string[];
  tags: string[];
};

type body = {
  rowsCount: number;
  readonly tags: string[];
  rows: string[][];
  currentRow: string[];
};

const selectors = {
  resultsTable: '[data-testid="results-table"]',
};

export class ResultTable extends BasePage {
  private readonly header: header;
  private readonly body: body;
  constructor(page: Page) {
    super(page);
    this.header = {
      columnsCount: 2,
      rowsCount: 1,
      columnsNames: ["Sequence name", "Sequence"],
      tags: ["thead", "tr", "th", "div"],
    };
    this.body = {
      rowsCount: 0,
      tags: ["tbody", "tr", "td", "div", "ul"],
      rows: [],
      currentRow: [],
    };
  }

  async setSize(size: number): Promise<void> {
    this.body.rowsCount = size;
  }

  async addRow(sequenceName: string, sequence: string) {
    let row: string[] = [];
    row.push(sequenceName, sequence);
    this.body.rows.push(row);
  }

  async completeRows(rows: any[]): Promise<void> {
    for (let row of this.body.rows) {
      let rowIndex = this.body.rows.indexOf(row);
      let values = Object.values(rows[rowIndex]);
      for (let value of values) {
        row.push(value as string);
      }
    }
  }

  async setHeader(vendors: string[]): Promise<void> {
    for (let vendor of vendors) {
      let displayedVendor = vendor;
      switch (vendor) {
        case "idtdna":
          displayedVendor = vendor.toUpperCase();
          break;
        case "twistdna":
          displayedVendor = "TwistDNA";
          break;
        case "thermofisher":
          displayedVendor = "ThermoFisher";
          break;
      }
      this.header.columnsNames.push(
        displayedVendor.charAt(0).toUpperCase() + displayedVendor.slice(1)
      );
    }

    for (let vendor of vendors) {
      switch (vendor) {
        case "idtdna":
          this.header.columnsNames.push(`Validity_${vendor.toUpperCase()}`);
          break;
        case "twistdna":
          this.header.columnsNames.push("Validity_TwistDNA");
          break;
        case "thermofisher":
          this.header.columnsNames.push("Validity_ThermoFisher");
          break;
        default:
          this.header.columnsNames.push(
            `Validity_${vendor.charAt(0).toUpperCase() + vendor.slice(1)}`
          );
          break;
      }
    }
    this.header.columnsCount += vendors.length * 2;
  }

  async checkHeader(): Promise<void> {
    let tableLocator = await this.waitForSelectorToBe({
      selector: selectors.resultsTable,
    });
    let head = await this.getLocator(this.header.tags[0], tableLocator);
    await this.assertLocatorsNbr(
      this.header.rowsCount,
      this.header.tags[1],
      head
    );

    let rowLocator = await this.getLocator(this.header.tags[1], head);
    await this.assertLocatorsNbr(
      this.header.columnsCount,
      this.header.tags[2],
      rowLocator
    );
    let thLocators = await this.getLocators(this.header.tags[2], rowLocator);
    await Promise.all(
      thLocators.map((locator, index) => this.checkHeaderCell(locator, index))
    );
  }

  async checkHeaderCell(locator: Locator, index: number) {
    await this.toHaveText(this.header.columnsNames[index], {
      elementLocator: locator,
    });
  }

  async checkSize(): Promise<void> {
    let tableLocator = await this.waitForSelectorToBe({
      selector: selectors.resultsTable,
    });
    let tableBody = await this.getLocator(this.body.tags[0], tableLocator);
    await this.assertLocatorsNbr(
      this.body.rowsCount,
      this.header.tags[1],
      tableBody
    );
  }

  async checkRow(rowIndex: number = 0): Promise<void> {
    this.body.currentRow = this.body.rows[rowIndex];
    let tableLocator = await this.waitForSelectorToBe({
      selector: selectors.resultsTable,
    });
    let bodyLocator = await this.waitForSelectorToBe({
      selector: this.body.tags[0],
      locator: tableLocator,
    });
    let rowSelector = `[data-testid="datatable-row-${rowIndex}"]`;
    let rowLocator = await this.waitForSelectorToBe({
      selector: rowSelector,
      locator: bodyLocator,
    });
    await rowLocator.scrollIntoViewIfNeeded();
    let tdLocators = await this.getLocators(this.body.tags[2], rowLocator);
    await Promise.all(
      tdLocators.map((locator, index) => this.checkCell(locator, index))
    );
  }
  async checkCell(locator: Locator, cellIndex: number) {
    let rowValues = this.body.currentRow;
    let divLocator = await this.waitForSelectorToBe({
      selector: this.body.tags[3],
      locator: locator,
    });
    let ulLocatorsNbr = await this.getNbrOfLocators(
      this.body.tags[4],
      divLocator
    );

    const vendorsNbr = (this.header.columnsCount - 2) / 2;
    let vendorsIndexes = [];
    for (let i = 0; i < vendorsNbr; i++) {
      vendorsIndexes.push(2 + i);
    }

    if (ulLocatorsNbr != 0) {
      const listItems = divLocator.locator("ul > li");
      const listTexts = await listItems.allTextContents();
      let onestring = listTexts.join(" ");
      expect(onestring).toEqual(rowValues[cellIndex]);
    } else if (vendorsIndexes.includes(cellIndex)) {
      const datatestId = await divLocator.getAttribute("data-testid");
      expect(datatestId).toEqual(rowValues[cellIndex]);
    } else {
      await this.toHaveText(rowValues[cellIndex], {
        elementLocator: divLocator,
      });
    }
  }
  async checkBody(): Promise<void> {
    await this.checkSize();
    for (let row of this.body.rows) {
      await this.checkRow(this.body.rows.indexOf(row));
    }
  }

  async checkResults(): Promise<void> {
    await this.checkHeader();
    await this.checkBody();
  }
}
