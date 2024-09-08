import { Readability } from "@mozilla/readability";
import fs from "fs";
import { parseHTML } from "linkedom";
import path from "path";
import { chromium } from "playwright";

// Create directories
const rootdir = path.join(process.cwd(), "output");
if (fs.existsSync(rootdir)) {
  fs.rmSync(rootdir, { recursive: true, force: true });
}
fs.mkdirSync(rootdir, { recursive: true });

const chaptersdir = path.join(rootdir, "chapters");
fs.mkdirSync(chaptersdir, { recursive: true });

// Start browser
const browser = await chromium.launch({
  headless: false,
});
const context = await browser.newContext();
const page = await context.newPage();

// Intercept and block requests
await page.route("**/*", (route, request) => {
  const url = request.url();

  if (
    url.endsWith(".js") ||
    url.endsWith(".css") ||
    url.endsWith(".jpg") ||
    url.endsWith(".png") ||
    url.endsWith(".gif") ||
    url.endsWith(".jpeg")
  ) {
    // Block the request
    route.abort();
  } else {
    // Continue with the request
    route.continue();
  }
});

// Get index
await page.goto(process.env.INDEX_URL!);

const links = await page.$$("a");
const urls = (
  await Promise.all(links.map(async (a) => await a.getAttribute("href")))
).map((l) => l!.replace(process.env.OLD_BASE_URL!, process.env.NEW_BASE_URL!));
const titles = (await Promise.all(
  links.map(async (a) => await a.textContent())
)) as string[];
console.log(`${urls.length} chapters`);

// Get chapters

for (const [index, url] of urls.entries()) {
  console.log(`Getting chapter ${index + 1}/${urls.length}: ${titles[index]}`);

  await page.goto(url);

  const content = await page.content();

  const { document } = parseHTML(content);

  const article = new Readability(document).parse()!;

  let html = `<h1>${titles[index]}</h1>\n\n`;
  html += article.content;

  fs.writeFileSync(path.join(chaptersdir, `${index + 1}.html`), html);
}

// Close the browser
await browser.close();
