import { chromium } from "playwright";

const browser = await chromium.launch({
  headless: false,
});

// Create a new browser context
const context = await browser.newContext();

// Open a new page
const page = await context.newPage();

// Navigate to the desired webpage
await page.goto(process.env.INDEX_URL!);

const links = await page.$$("a");
const urls = await Promise.all(
  links.map(async (a) => await a.getAttribute("href"))
);

console.log(urls);

// Close the browser
await browser.close();
