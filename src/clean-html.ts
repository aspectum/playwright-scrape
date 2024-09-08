import fs from "fs";
import path from "path";
import { tidy } from "htmltidy2";

let cMd = fs
  .readFileSync(path.join(process.cwd(), "output", "merged.html"))
  .toString();

const opts = {
  doctype: "strict",
  hideComments: true,
};

tidy(cMd, opts, function (_, html) {
  fs.writeFileSync(path.join(process.cwd(), "output", "clean.html"), html);
});
