import * as vscode from "vscode";
import { encode as htmlEncode, decode as htmlDecode } from "html-entities";
import * as yaml from "js-yaml";

let activeEditor: vscode.TextEditor | undefined;

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "text-utils" is now active!');

  activeEditor = vscode.window.activeTextEditor;
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      activeEditor = editor;
    })
  );

  registerCommands(context);
}

function registerCommands(context: vscode.ExtensionContext) {
  const commands: [string, () => Promise<void>][] = [
    ["text-utils.dedup-lines-selection", dedupLinesSelection],
    ["text-utils.sort-lines-asc", sortLinesAsc],
    ["text-utils.sort-lines-desc", sortLinesDesc],
    ["text-utils.convert-to-uppercase", convertToUppercase],
    ["text-utils.convert-to-lowercase", convertToLowercase],
    ["text-utils.base64-encode", base64Encode],
    ["text-utils.base64-decode", base64Decode],
    ["text-utils.remove-empty-lines", removeEmptyLines],
    ["text-utils.html-entity-encode", htmlEntityEncode],
    ["text-utils.html-entity-decode", htmlEntityDecode],
    ["text-utils.yaml-to-json", yamlToJson],
    ["text-utils.json-to-yaml", jsonToYaml],
  ];

  commands.forEach(([id, handler]) => {
    const disposable = vscode.commands.registerCommand(id, handler);
    context.subscriptions.push(disposable);
  });
}

function getSelectedText(): string | undefined {
  if (!activeEditor) {
    vscode.window.showWarningMessage("No active editor");
    return;
  }
  const selection = activeEditor.selection;
  return activeEditor.document.getText(selection);
}

async function replaceSelection(replaceWith: string): Promise<boolean> {
  if (!activeEditor) {
    vscode.window.showWarningMessage("No active editor");
    return false;
  }
  const selection = activeEditor.selection;
  return activeEditor.edit((editBuilder) => {
    editBuilder.replace(selection, replaceWith);
  });
}

async function executeCommand(
  operation: (text: string) => string,
  successMessage: string
): Promise<void> {
  const selectedText = getSelectedText();
  if (!selectedText) {
    vscode.window.showErrorMessage("No text selected!");
    return;
  }
  const result = operation(selectedText);
  const success = await replaceSelection(result);
  if (success) {
    vscode.window.showInformationMessage(successMessage);
  }
}

// Command handlers
async function dedupLinesSelection(): Promise<void> {
  await executeCommand(
    (text) => [...new Set(text.split("\n"))].join("\n"),
    "Removed duplicates from the selection!"
  );
}

async function sortLinesAsc(): Promise<void> {
  await executeCommand(
    (text) => text.trim().split("\n").sort().join("\n"),
    "Selected lines sorted in Ascending order!"
  );
}

async function sortLinesDesc(): Promise<void> {
  await executeCommand(
    (text) =>
      text
        .split("\n")
        .sort((a, b) => b.localeCompare(a))
        .join("\n"),
    "Selected lines sorted in Descending order!"
  );
}

async function convertToUppercase(): Promise<void> {
  await executeCommand(
    (text) => text.toLocaleUpperCase(),
    "Converted to Uppercase"
  );
}

async function convertToLowercase(): Promise<void> {
  await executeCommand(
    (text) => text.toLocaleLowerCase(),
    "Converted to Lowercase"
  );
}

async function base64Encode(): Promise<void> {
  await executeCommand(
    (text) => Buffer.from(text, "binary").toString("base64"),
    "Converted to Base64"
  );
}

async function base64Decode(): Promise<void> {
  await executeCommand(
    (text) => Buffer.from(text, "base64").toString("binary"),
    "Decoded from Base64"
  );
}

async function removeEmptyLines(): Promise<void> {
  await executeCommand(
    (text) => text.replace(/^\s*\n/gm, ""),
    "Removed empty lines"
  );
}

async function htmlEntityEncode(): Promise<void> {
  await executeCommand(
    (text) => htmlEncode(text),
    "Converted to HTML Entities"
  );
}

async function htmlEntityDecode(): Promise<void> {
  await executeCommand(
    (text) => htmlDecode(text),
    "Decoded from HTML Entities"
  );
}

async function yamlToJson(): Promise<void> {
  await executeCommand(
    (text) => JSON.stringify(yaml.load(text), null, 2),
    "Converted YAML to JSON"
  );
}

async function jsonToYaml(): Promise<void> {
  await executeCommand(
    (text) => yaml.dump(JSON.parse(text)),
    "Converted JSON to YAML"
  );
}

export function deactivate() {}
