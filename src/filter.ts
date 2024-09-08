import fs from "fs";

import { parseHTML } from "linkedom";

const file = fs.readFileSync("./output/clean.html", { encoding: "utf-8" });

const { document: doc } = parseHTML(file);

const toRemove = [
  /Chapter \d+/,
  /Tip: You can use left, right, A and D keyboard/,
  /The source of this content is/,
  /The Novel will be updated first on this website/,
  /Occasionally missing content/,
  /Discord link for quickest updates/,
];

// <p>Tip: You can use left, right, A and D keyboard keys to browse between chapters.</p>
// <p>The source of this content is nov/el/bin[./]net'</p>

let i = 0;
doc.querySelectorAll("p").forEach((p) => {
  if (toRemove.some((re) => p.textContent?.match(re))) {
    console.log(p.textContent);
    p.remove();
    i += 1;
  }
});

const out = doc.documentElement.outerHTML;

fs.writeFileSync("./output/filtered.html", out);

console.log(i);
