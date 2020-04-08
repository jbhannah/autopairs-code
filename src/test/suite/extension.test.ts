import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import Jumper from '../../jumper';

suite("Jump test", () => {
    test("Basic jump", async () => {
        const text = [
            "{",
            "    a}",
            "}",
        ];

        const document = await initDocument(text.join('\n'));

        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            assert.fail("editor undefined");
        }

        const pos = new vscode.Position(1, 5);
        document.positionAt(document.offsetAt(pos));
        editor.selection = new vscode.Selection(pos, pos);

        const j = new Jumper;
        const jumped = await j.tryJump("}", new vscode.Range(pos,pos));
        assert.equal(jumped, true);

        const newPos = editor.selection.active;
        const expected = new vscode.Position(2,1);

        assert.deepEqual(newPos, expected);

        const expectedText: string[] = [
            "{",
            "    a",
            "}",
        ];
        const acutalText = document.getText();

        assert.equal(acutalText, expectedText.join('\n'));
    });

    test("Basic jump with trailing whitespace", async () => {
        const text = [
            "{",
            "    a}",
            "}",
            "",
            "",
        ];

        const document = await initDocument(text.join('\n'));

        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            assert.fail("editor undefined");
        }

        const pos = new vscode.Position(1, 5);
        document.positionAt(document.offsetAt(pos));
        editor.selection = new vscode.Selection(pos, pos);

        const j = new Jumper;
        const jumped = await j.tryJump("}", new vscode.Range(pos,pos));
        assert.equal(jumped, true);

        const newPos = editor.selection.active;
        const expected = new vscode.Position(2,1);

        assert.deepEqual(newPos, expected);

        const expectedText: string[] = [
            "{",
            "    a",
            "}",
            "",
            "",
        ];
        const acutalText = document.getText();

        assert.equal(acutalText, expectedText.join('\n'));
    });
    test("Nested jump", async () => {
        const text = [
            "{",
            "    {",
            "        a}",
            "    }",
            "}",
        ];

        const document = await initDocument(text.join('\n'));

        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            assert.fail("editor undefined");
        }

        const pos = new vscode.Position(2, 9);
        document.positionAt(document.offsetAt(pos));
        editor.selection = new vscode.Selection(pos, pos);

        const j = new Jumper;
        const jumped = await j.tryJump("}", new vscode.Range(pos,pos));
        assert.equal(jumped, true);

        const newPos = editor.selection.active;
        const expected = new vscode.Position(3,5);

        assert.deepEqual(newPos, expected);

        const expectedText: string[] = [
            "{",
            "    {",
            "        a",
            "    }",
            "}",
        ];
        const acutalText = document.getText();

        assert.equal(acutalText, expectedText.join('\n'));
    });

    test("Empty jump", async () => {
        const text: string[] = [
            "{",
            "}",
            "}",
        ];
        const document = await initDocument(text.join('\n'));

        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            assert.fail("editor undefined");
        }

        const pos = new vscode.Position(1, 4);
        document.positionAt(document.offsetAt(pos));
        editor.selection = new vscode.Selection(pos, pos);

        const j = new Jumper;
        const jumped = await j.tryJump("}", new vscode.Range(
            new vscode.Position(1,0),
            new vscode.Position(1,4),
        ));
        assert.equal(jumped, true);

        const newPos = editor.selection.active;
        const expected = new vscode.Position(2,1);

        assert.deepEqual(newPos, expected);

        const expectedText: string[] = [
            "{",
            "",
            "}",
        ];
        const acutalText = document.getText();

        assert.equal(acutalText, expectedText.join('\n'));
    });

    test("Empty nested jump", async () => {
        const text: string[] = [
            "{",
            "    {",
            "    }",
            "    }",
            "}",
        ];
        const document = await initDocument(text.join('\n'));

        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            assert.fail("editor undefined");
        }

        const pos = new vscode.Position(2, 8);
        document.positionAt(document.offsetAt(pos));
        editor.selection = new vscode.Selection(pos, pos);

        const j = new Jumper;
        const jumped = await j.tryJump("}", new vscode.Range(
            new vscode.Position(2,0),
            new vscode.Position(2,8),
        ));
        assert.equal(jumped, true);

        const newPos = editor.selection.active;
        const expected = new vscode.Position(3,5);

        assert.deepEqual(newPos, expected);

        const expectedText: string[] = [
            "{",
            "    {",
            "",
            "    }",
            "}",
        ];
        const acutalText = document.getText();

        assert.equal(acutalText, expectedText.join('\n'));
    });

    test("Same line jump", async () => {
        const text: string[] = [
            "{ a} }  ",
        ];
        const document = await initDocument(text.join('\n'));

        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            assert.fail("editor undefined");
        }

        const pos = new vscode.Position(0, 3);
        document.positionAt(document.offsetAt(pos));
        editor.selection = new vscode.Selection(pos, pos);

        const j = new Jumper;
        const jumped = await j.tryJump("}", new vscode.Range(
            new vscode.Position(0,3),
            new vscode.Position(0,3),
        ));
        assert.equal(jumped, true);

        const newPos = editor.selection.active;
        const expected = new vscode.Position(0,5);

        assert.deepEqual(newPos, expected);

        const expectedText: string[] = [
            "{ a }  ",
        ];
        const acutalText = document.getText();

        assert.equal(acutalText, expectedText.join('\n'));
    });
});

async function initDocument(text: string): Promise<vscode.TextDocument> {
    const document = await vscode.workspace.openTextDocument({ content: text });
    await vscode.window.showTextDocument(document);
    return document;
}
