import fs from "fs";
import path from "path";

const rootdir = path.join(process.cwd(), "output");

let html = "";

// handle dirty directory (non-html files and subfolders)
const dirContents = fs.readdirSync(path.join(rootdir, "chapters"), {
  withFileTypes: true,
});
const chaps = dirContents
  .filter((dirent) => dirent.isFile())
  .map((dirent) => dirent.name)
  .filter((fileName) => fileName.match(/.html$/))
  .sort((a, b) => +a.replace(".html", "") - +b.replace(".html", ""));

// defining function to preserve async order
chaps.forEach((chap) => {
  // reading chapter file
  const cHtml = fs
    .readFileSync(path.join(rootdir, "chapters", chap))
    .toString();

  // adding page break at the end of the chapter
  html =
    html + cHtml + "\n" + '<div style="page-break-after: always;"></div>\n\n';
});

// write merged file
if (fs.existsSync(path.join(rootdir, "merged.html"))) {
  fs.rmSync(path.join(rootdir, "merged.html"), {
    recursive: true,
    force: true,
  });
}
fs.writeFileSync(path.join(rootdir, "merged.html"), html);
