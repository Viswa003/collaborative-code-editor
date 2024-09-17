// CodeEditor.js
import React from 'react';
import AceEditor from 'react-ace';
import ace from 'ace-builds';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';

import './CodeEditor.css';

// Set the path to ace worker files
ace.config.set('workerPath', '/ace-builds/src-noconflict/');

const CodeEditor = ({ code, language, onCodeChange }) => {
  const handleEditorChange = (newCode) => {
    onCodeChange(newCode);
  };

  return (
    <div className="code-editor">
      <AceEditor
        mode={language}
        theme="monokai"
        onChange={handleEditorChange}
        name="UNIQUE_ID_OF_DIV"
        editorProps={{ $blockScrolling: true }}
        value={code}
        fontSize={14}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: false,
          showLineNumbers: true,
          tabSize: 2,
        }}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};


export default CodeEditor;