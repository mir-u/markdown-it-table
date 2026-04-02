import { describe, beforeEach, it } from "vitest";

import fs from "node:fs";
import path from "node:path";

import markdownIt from "markdown-it";
import { markdownItTable } from "../";

const testMd = (name) => (ctx) => {
  const filename = path.resolve(__dirname, `__fixtures__/${name}.md`);
  const input = fs.readFileSync(filename, "utf8");
  ctx
    .expect(ctx.md.render(input))
    .toMatchFileSnapshot(`./__snapshots__/${name}.html`);
};

const render = (md, input) => md.render(input);

describe("markdown-it-table", () => {
  beforeEach((ctx) => {
    ctx.md = markdownIt("commonmark").use(markdownItTable, {});
  });

  it("should parse simple table", testMd("simple"));

  it("should parse complex table", testMd("complex"));

  it("should parse cell with blockquote", testMd("blockquote"));

  it(
    "should parse table with redundant indentations",
    testMd("indentation"),
  );

  it("should parse table with multiple columns", testMd("multi-column"));

  it("should parse table without proper spacing", testMd("no-spacing"));

  it("should parse table with missing cell", testMd("table-missing-cell"));

  it("should parse table with empty list", testMd("table-empty-list"));

  it.skip("should parse table inside list", testMd("table-inside-list"));

  it("should parse table followed by empty list", testMd("table-followed-by-empty-list"));

  it("should parse table followed by number dot", testMd("table-followed-by-number-dot"));

  it("should parse table with pipe space dash space pipe pattern", testMd("table-with-pipe-space-dash-space-pipe-pattern"));

  it("should parse table with pipe space dash pipe pattern", testMd("table-with-pipe-space-dash-pipe-pattern"));

  it("should render padded bare list markers as text cells", ({ expect, md }) => {
    const input = `| A | B | C |
|---|---|---|
| - | * | 1. |
| -| *| 1.|
`;

    expect(render(md, input)).toBe(`<table>
<tr>
<th>
<p>A</p>
</th>
<th>
<p>B</p>
</th>
<th>
<p>C</p>
</th>
</tr>
<tr>
<td>
<p>-</p>
</td>
<td>
<p>*</p>
</td>
<td>
<p>1.</p>
</td>
</tr>
<tr>
<td>
<p>-</p>
</td>
<td>
<p>*</p>
</td>
<td>
<p>1.</p>
</td>
</tr>
</table>
`);
  });

  it("should preserve compact bare list marker behavior inside cells", ({ expect, md }) => {
    const input = `| A | B | C |
|---|---|---|
|-|*|1.|
`;

    expect(render(md, input)).toBe(`<table>
<tr>
<th>
<p>A</p>
</th>
<th>
<p>B</p>
</th>
<th>
<p>C</p>
</th>
</tr>
<tr>
<td>
<p></p>
</td>
<td>
<p></p>
</td>
<td>
<p></p>
</td>
</tr>
</table>
`);
  });

  it("should preserve paragraph wrappers for empty body cells", ({ expect, md }) => {
    const input = `| A | B |
|---|---|
| value | |
`;

    expect(render(md, input)).toBe(`<table>
<tr>
<th>
<p>A</p>
</th>
<th>
<p>B</p>
</th>
</tr>
<tr>
<td>
<p>value</p>
</td>
<td>
<p></p>
</td>
</tr>
</table>
`);
  });
});
