import { Status } from "@cucumber/cucumber";

export async function captureScreenshots(scenario: any, page: any) {
  if (scenario.result!.status === Status.FAILED) {
    const timeStamp = generateTimeStamp();
    await page.screenshot({
      path: `./artifacts/screenshots/${scenario.pickle.name}_${timeStamp}.png`,
      fullPage: true,
    });

    console.log(`scenario failed:${scenario.pickle.name}`);
  }
}

export function generateTimeStamp() {
  let date = new Date();

  let currentDate =
    date.getDate() +
    "_" +
    (date.getMonth() + 1) +
    "_" +
    date.getFullYear() +
    "_" +
    date.getHours() +
    "_" +
    date.getMinutes() +
    "_" +
    date.getSeconds() +
    "_" +
    date.getMilliseconds();

  return currentDate;
}
