import { Page } from "@playwright/test";
import { BasePage } from "./basePage";
import { SequenceTable } from "./components/sequenceTable";
import * as fs from "fs";
import { ResultTable } from "./components/resultsTable";
import Papa from "papaparse";
const selectors = {
  addButton: '[data-testid="submit-sequence-button"]',
  uploadFileLabel: '[for="file-upload"]',
  sequencesTable: '[data-testid="table"]',
  inputField: '[data-testid="sequence-text-area"]',
  deleteSequenceButton: '[data-testid="delete-sequence-0"]',
  validateButton: '[data-testid="validate-sequences-button"]',
  validatingSpinner: '[data-testid="processVendors-loading"]',
  resultsTable: '[data-testid="results-table"]',
};

export class SequencePage extends BasePage {
  private readonly sequenceTable: SequenceTable;
  private readonly resultTable: ResultTable;
  private readonly processingTimeout: number;
  constructor(page: Page) {
    super(page);
    this.sequenceTable = new SequenceTable(page);
    this.resultTable = new ResultTable(page);
    this.processingTimeout = this.timeout * 8;
  }

  async type(sequence: string) {
    await this.fill(selectors.inputField, sequence);
    this.sequenceTable.addRow(sequence);
  }

  async clickOnAddButton() {
    await this.click(selectors.addButton);
  }

  async check(): Promise<void> {
    await this.sequenceTable.checkHeader();
    await this.sequenceTable.checkBody();
  }

  async shouldNotBeAdded(): Promise<void> {
    await this.elementShouldBe(
      selectors.sequencesTable,
      this.elementStates.hidden
    );
  }

  async shouldBeDeleted(): Promise<void> {
    await this.shouldNotBeAdded();
  }

  async isNotificationShown(message: string): Promise<boolean> {
    return await this.page.getByText(`${message}`).isVisible();
  }

  async upload(filePath: string): Promise<void> {
    await this.setInputFiles(selectors.uploadFileLabel, filePath);
  }

  async parseFile(filePath: string): Promise<void> {
    const source = filePath.substring(filePath.lastIndexOf("/") + 1);
    const content = fs.readFileSync(filePath, "utf-8");

    const sequences = content.trim().split(">").slice(1);
    this.resultTable.setSize(sequences.length);

    sequences.forEach((seq) => {
      const lines = seq.split("\n");

      const sequenceName = lines[0].trim();

      const sequence = lines.slice(1).join("").replace(/\n/g, "");

      this.sequenceTable.addRow(sequence, source, sequenceName);
      this.resultTable.addRow(sequenceName, sequence);
    });
  }

  async validate(): Promise<void> {
    await this.click(selectors.validateButton);
  }

  async waitForValidation(): Promise<void> {
    await this.waitForSelectorToBe({
      selector: selectors.validatingSpinner,
      status: this.elementStates.hidden,
      timeout: this.processingTimeout,
    });
  }

  async getResults(): Promise<void> {
    await this.waitForSelectorToBe({ selector: selectors.resultsTable });
  }

  async parseResults(resultsFile: string): Promise<void> {
    const csvData = fs.readFileSync(resultsFile, "utf8");
    const parsedData = Papa.parse(csvData, { header: true });
    await this.resultTable.completeRows(parsedData.data);
  }

  async checkResults(
    expectedResults: string,
    vendors: string[]
  ): Promise<void> {
    await this.parseResults(expectedResults);
    await this.resultTable.setHeader(vendors);
    await this.resultTable.checkHeader();
    await this.resultTable.checkBody();
  }

  async delete(index: number = 0): Promise<void> {
    const deleteButtonselector = `[data-testid="delete-sequence-${index}"]`;
    await this.click(deleteButtonselector);
  }

  async checkResultsVisibility(): Promise<void> {
    await this.elementShouldBe(
      selectors.resultsTable,
      this.elementStates.hidden
    );
  }
}
