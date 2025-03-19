import { generateTimeStamp } from "./tools";
const report = require("cucumber-html-reporter");

const options = {
  brandtitle: "Manufacturability Vendors Application",
  theme: "bootstrap",
  jsonFile: "test-results/cucumber-report.json",
  output: `artifacts/reports/cucumber_report_${generateTimeStamp()}.html`,
  screenshotsDirectory: "./Screenshots/",
  storeScreenshots: true,
  reportSuiteAsScenarios: true,
  lauchReport: true,
  metadata: {
    "App Version": "1.1.1",
    "Test Environment": "QA",
    Platform: "web/Next.js",
    Sprint: "001",
  },
};

report.generate(options);
