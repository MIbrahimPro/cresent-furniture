import { readFileSync, writeFileSync } from "node:fs";

const rep = JSON.parse(readFileSync("social/report.json", "utf8"));
const fence = "```";
let md = `# Crescent — Instagram captions (15 posts)

All posts are 1080×1350 (4:5). PNGs in \`social/png/\`, editable SVG masters in \`social/posts/\`.
Regenerate anytime: \`node social/build-posts.mjs\`.

---

`;
for (const p of rep) {
  md += `## ${p.name}\n\n![post](png/${p.name}.png)\n\n${fence}${p.caption}${fence}\n\n---\n\n`;
}
writeFileSync("social/captions.md", md);
console.log("captions.md written,", rep.length, "posts");
