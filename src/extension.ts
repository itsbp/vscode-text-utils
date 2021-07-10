// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	let activeEditor = vscode.window.activeTextEditor;
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "text-utils" is now active!');
	function getSelectedText () {
		if (!activeEditor) {
			console.warn("No active editor");
			return;
		}		
		const document = activeEditor.document;
		const selection = activeEditor.selection;
		if (!selection) {
			console.warn("No selection done in active editor");
			return;
		}

		// Get the word within the selection
		return document.getText(selection);
		
	}
	function replaceSelection(replaceWith:any) {
		if (!activeEditor) {
			console.warn("no active editor found when trying to replace selection");
			return;
		}
		const selection = activeEditor.selection;
		if (!selection) {
			console.warn("no selection found");
			return;
		}
		activeEditor.edit(editBuilder => {
			editBuilder.replace(selection, replaceWith);
		});

	}
	let dedupCommand = vscode.commands.registerCommand('text-utils.dedup-lines-selection', () => {
		const selectedLines = getSelectedText();
		if (!selectedLines) {
			vscode.window.showErrorMessage('No text selected!');
			return;
		}
		const uniqueLines = [...new Set(selectedLines.split('\n'))].join('\n');
		replaceSelection(uniqueLines);
		vscode.window.showInformationMessage('Removed duplicates from the selection!');
	});
	let sortAscCommand = vscode.commands.registerCommand('text-utils.sort-lines-asc', () => {
		const selectedLines = getSelectedText();
		if (!selectedLines) {
			vscode.window.showErrorMessage('No text selected!');
			return;
		}
		const sortedText = selectedLines.split('\n').sort().join('\n');
		replaceSelection(sortedText);
		vscode.window.showInformationMessage('Selected lines sorted in Ascending order!');
	});
	let sortDescCommand = vscode.commands.registerCommand('text-utils.sort-lines-desc', () => {	
		// Get the word within the selection
		const selectedLines = getSelectedText();
		if (!selectedLines) {
			vscode.window.showErrorMessage('No text selected!');
			return;
		}
		const reversed = selectedLines.split('\n').sort((one, two) => (one > two ? -1 : 1)).join('\n');
		replaceSelection(reversed);
		
		vscode.window.showInformationMessage('Selected lines sorted in Ascending order!');
	});

	let toUpperCmd = vscode.commands.registerCommand('text-utils.convert-to-uppercase', () => {	
		// Get the word within the selection
		const selectedLines = getSelectedText();
		if (!selectedLines) {
			vscode.window.showErrorMessage('No text selected!');
			return;
		}
		const upperCased = selectedLines.toLocaleUpperCase();
		replaceSelection(upperCased);
		
		vscode.window.showInformationMessage('Converted to Uppercase');
	});
	let toLowerCmd = vscode.commands.registerCommand('text-utils.convert-to-lowercase', () => {	
		// Get the word within the selection
		const selectedLines = getSelectedText();
		if (!selectedLines) {
			vscode.window.showErrorMessage('No text selected!');
			return;
		}
		const lowerCased = selectedLines.toLocaleLowerCase();
		replaceSelection(lowerCased);
		
		vscode.window.showInformationMessage('Converted to Lowercase');
	});

	let base64EncodeCmd = vscode.commands.registerCommand('text-utils.base64-encode', () => {	
		// Get the word within the selection
		const selectedLines = getSelectedText();
		if (!selectedLines) {
			vscode.window.showErrorMessage('No text selected!');
			return;
		}
		const coverted = Buffer.from(selectedLines, 'binary').toString('base64');
		replaceSelection(coverted);
		
		vscode.window.showInformationMessage('Converted to Lowercase');
	});
	let base64DecodeCmd = vscode.commands.registerCommand('text-utils.base64-decode', () => {	
		// Get the word within the selection
		const selectedLines = getSelectedText();
		if (!selectedLines) {
			vscode.window.showErrorMessage('No text selected!');
			return;
		}
		const coverted = Buffer.from(selectedLines, 'base64').toString('binary');
		replaceSelection(coverted);
	});
	

	context.subscriptions.push(dedupCommand);
	context.subscriptions.push(sortAscCommand);
	context.subscriptions.push(sortDescCommand);
	context.subscriptions.push(toUpperCmd);
	context.subscriptions.push(toLowerCmd);
	context.subscriptions.push(base64EncodeCmd);
	context.subscriptions.push(base64DecodeCmd);
}

// this method is called when your extension is deactivated
export function deactivate() {}
