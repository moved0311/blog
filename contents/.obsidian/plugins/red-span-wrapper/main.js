const { Plugin } = require("obsidian");

const OPEN_TAG = '<span style="color: #e03f19;">';
const CLOSE_TAG = "</span>";

module.exports = class RedSpanWrapperPlugin extends Plugin {
  async onload() {
    this.addCommand({
      id: "wrap-selection-in-red-span",
      name: "Wrap selection in red span",
      hotkeys: [
        {
          modifiers: ["Mod"],
          key: "r",
        },
      ],
      editorCallback: (editor) => {
        const selection = editor.getSelection();
        const replacement = `${OPEN_TAG}${selection}${CLOSE_TAG}`;

        editor.replaceSelection(replacement);

        if (!selection) {
          const cursor = editor.getCursor();
          editor.setCursor({
            line: cursor.line,
            ch: cursor.ch - CLOSE_TAG.length,
          });
        }
      },
    });
  }
};
