import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import i18n from '@/i18n';

let intelliSenseDatabase = monaco.languages.registerCompletionItemProvider('sql', {
  provideCompletionItems: () => {
    return { suggestions: [] };
  },
});

const checkTableContext = (text) => {
  const normalizedText = text.trim().toUpperCase();
  const tableKeywords = ['FROM', 'JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'UPDATE'];

  for (const keyword of tableKeywords) {
    if (normalizedText.endsWith(keyword)) {
      return true;
    }
  }

  return false;
};

const registerIntelliSenseDatabase = (databaseName: Array<{name:string, dataSourceName:string}>) => {
  console.log('registerIntelliSenseDatabase', databaseName);
  intelliSenseDatabase.dispose();
  intelliSenseDatabase = monaco.languages.registerCompletionItemProvider('sql', {
    triggerCharacters: [' '],
    provideCompletionItems: (model, position) => {
      const lineContentUntilPosition = model.getValueInRange({
        startLineNumber: position.lineNumber,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column,
      });
      const isTableContext = checkTableContext(lineContentUntilPosition);

      return {
        suggestions: (databaseName || []).map(({name, dataSourceName}) => ({
          label: {
            label: name,
            // detail: `(${dataSourceName})`,
            description: i18n('sqlEditor.text.databaseName'),
          },
          sortText: isTableContext ? '01' : '08',
          kind: monaco.languages.CompletionItemKind.database,
          insertText: databaseName,
        })),
      };
    },
  });
};

export { intelliSenseDatabase, registerIntelliSenseDatabase };