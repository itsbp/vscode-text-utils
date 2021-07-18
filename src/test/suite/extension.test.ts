import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
// import * as myExtension from '../../extension';
export async function doc(content: string, language?: string) {
    return await vscode.workspace.openTextDocument({
        language,
        content,
    });
}

export async function sleep(ms: number): Promise<void> {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}
	
export async function openFile(content: string): Promise<vscode.TextDocument> {
    const document = doc(content);
	vscode.window.showTextDocument(await document);
	await sleep(1200000);
    return document;
}

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Sample test', () => {
		const document = openFile('uniqueTextTest\nSecond line');
		console.log("Test done");
		assert.strictEqual(-1, [1, 2, 3].indexOf(5));
		assert.strictEqual(-1, [1, 2, 3].indexOf(0));
	});
});
