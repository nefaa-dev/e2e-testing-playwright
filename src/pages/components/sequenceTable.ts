import { BasePage } from "../basePage";
import { Locator, Page } from "@playwright/test";

const selectors = {
  sequencesTable: '[data-testid="table"]',
};

type header = Readonly<{
  columnsCount: number;
  rowsCount: number;
  columnsNames: string[];
  tags: string[];
}>;

type body = {
  rowsCount: number;
  readonly tags: string[];
  rows: string[][];
  currentRow: string[];
};

export class SequenceTable extends BasePage {
  private readonly header: header;
  private readonly body: body;
  constructor(page: Page) {
    super(page);
    this.header = {
      columnsCount: 5,
      rowsCount: 1,
      columnsNames: ["Source", "Sequence name", "Sequence", "Note", "Actions"],
      tags: ["thead", "tr", "th"],
    };
    this.body = {
      rowsCount: 0,
      tags: ["tbody", "tr", "td", "div"],
      rows: [],
      currentRow: [],
    };
  }

  async checkHeader(): Promise<void> {
    let tableLocator = await this.waitForSelectorToBe({selector:selectors.sequencesTable});
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

    let thList = await this.getLocators(this.header.tags[2], rowLocator);
    await Promise.all(
      thList.map((locator, index) => this.checkHeaderCell(locator, index))
    );
  }

  async checkHeaderCell(locator: Locator, index: number) {
    await this.toHaveText(this.header.columnsNames[index], {
      elementLocator: locator,
    });
  }
  async checkBody(): Promise<void> {
    for (let row of this.body.rows) {
      await this.checkRow(this.body.rows.indexOf(row));
    }
  }

  async checkRow(rowIndex: number = 0): Promise<void> {
    this.body.currentRow = this.body.rows[rowIndex];
    let tableLocator = await this.waitForSelectorToBe({selector:selectors.sequencesTable});
    let bodyLocator = await this.waitForSelectorToBe(
      {selector:this.body.tags[0],
      locator:tableLocator}
    );
    let rowSelector = `[data-testid="datatable-row-${rowIndex}"]`;
    let rowLocator = await this.waitForSelectorToBe(
      {selector:rowSelector,
      locator:bodyLocator}
    );
    let tdLocators = await this.getLocators(this.body.tags[2], rowLocator);
    await Promise.all(
      tdLocators.map((locator, index) => this.checkCell(locator, index))
    );
  }

  async checkCell(locator: Locator, cellIndex: number) {
    let targetLocator = locator;
    const rowValues = this.body.currentRow;
    const rowIndex = this.body.rows.indexOf(rowValues);

    if (![0, 3, 4].includes(cellIndex)) {
      targetLocator = await this.waitForSelectorToBe(
        {selector:this.body.tags[3],
        locator:locator}
      );
    } else if (cellIndex == 4) {
      let deleteBtnSelector = `[data-testid="delete-sequence-${rowIndex}"]`;
      await this.waitForSelectorToBe(
        {selector:deleteBtnSelector,
        locator:locator}
      );
      return;
    }
    await this.toHaveText(rowValues[cellIndex], {
      elementLocator: targetLocator,
    });
  }

  addRow(
    sequence: string,
    source: string = "text_input",
    sequenceName?: string,
    note: string = ""
  ) {
    this.body.rowsCount++;
    if (!sequenceName) {
      sequenceName = `sequence ${this.body.rowsCount}`;
    }
    let row: string[] = [];

    row.push(source);
    row.push(sequenceName);
    row.push(sequence);
    row.push(note);
    this.body.rows.push(row);
  }
}
