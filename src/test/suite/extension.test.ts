// extension.test.ts
import * as assert from "assert";
import * as vscode from "vscode";

async function setupEditor(content: string): Promise<vscode.TextEditor> {
  const document = await vscode.workspace.openTextDocument({ content: "" });
  const editor = await vscode.window.showTextDocument(document);
  await editor.edit((editBuilder) => {
    editBuilder.insert(new vscode.Position(0, 0), content);
  });
  return editor;
}

async function runCommand(
  editor: vscode.TextEditor,
  command: string,
  selection: vscode.Selection
): Promise<void> {
  editor.selection = selection;
  await vscode.commands.executeCommand(command);
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function closeAllEditors(): Promise<void> {
  await vscode.commands.executeCommand("workbench.action.closeAllEditors");
}
suite("Extension Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests.");

  const testCases = [
    {
      name: "Sort lines in ascending order",
      input: "b\na\nc\n",
      command: "text-utils.sort-lines-asc",
      expected: "a\nb\nc",
    },
    {
      name: "Dedup lines in selection",
      input: "a\nb\na\n",
      command: "text-utils.dedup-lines-selection",
      expected: "a\nb\n",
    },
    {
      name: "Sort lines in descending order",
      input: "b\na\nc\n",
      command: "text-utils.sort-lines-desc",
      expected: "c\nb\na\n",
    },
    {
      name: "Remove empty lines in selection",
      input: "a\n\nb\n\nc\n",
      command: "text-utils.remove-empty-lines",
      expected: "a\nb\nc\n",
    },
    {
      name: "Convert to uppercase",
      input: "hello\nworld\n",
      command: "text-utils.convert-to-uppercase",
      expected: "HELLO\nWORLD\n",
    },
    {
      name: "Convert to lowercase",
      input: "HELLO\nWORLD\n",
      command: "text-utils.convert-to-lowercase",
      expected: "hello\nworld\n",
    },
    {
      name: "Base64 encode",
      input: "hello\nworld\n",
      command: "text-utils.base64-encode",
      expected: "aGVsbG8Kd29ybGQK",
    },
    {
      name: "Base64 decode",
      input: "aGVsbG8Kd29ybGQK",
      command: "text-utils.base64-decode",
      expected: "hello\nworld\n",
    },
    {
      name: "HTML Entity Encode",
      input: "<div>Hello & World</div>",
      command: "text-utils.html-entity-encode",
      expected: "&lt;div&gt;Hello &amp; World&lt;/div&gt;",
    },
    {
      name: "HTML Entity Decode",
      input: "&lt;div&gt;Hello &amp; World&lt;/div&gt;",
      command: "text-utils.html-entity-decode",
      expected: "<div>Hello & World</div>",
    },
  ];

  testCases.forEach(({ name, input, command, expected }) => {
    test(name, async () => {
      try {
        const editor = await setupEditor(input);
        const selection = new vscode.Selection(
          0,
          0,
          editor.document.lineCount,
          0
        );
        await runCommand(editor, command, selection);
        await sleep(100); // Short delay
        assert.strictEqual(editor.document.getText(), expected);
      } finally {
        await closeAllEditors();
      }
    });
  });
});
