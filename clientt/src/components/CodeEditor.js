import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-twilight';
import socket from '../socket'; // Import the socket instance
import './CodeEditor.css';

const CodeEditor = ({ language = 'javascript', theme = 'monokai' }) => {
  const [code, setCode] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [selectedTheme, setSelectedTheme] = useState(theme);

  useEffect(() => {
    socket.on('codeChange', (newCode) => {
      setCode(newCode);
    });

    return () => {
      socket.off('codeChange');
    };
  }, []);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    socket.emit('codeChange', newCode);
  };

  return (
    <div className="CodeEditor">
      <div className="controls">
        <select value={selectedLanguage} onChange={e => setSelectedLanguage(e.target.value)}>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
        </select>
        <select value={selectedTheme} onChange={e => setSelectedTheme(e.target.value)}>
          <option value="monokai">Monokai</option>
          <option value="github">GitHub</option>
          <option value="twilight">Twilight</option>
        </select>
      </div>
      <div className="editor">
        <AceEditor
          mode={selectedLanguage}
          theme={selectedTheme}
          value={code}
          onChange={handleCodeChange}
          fontSize={14}
          showPrintMargin={true}
          showGutter={true}
          highlightActiveLine={true}
          setOptions={{
            useWorker: false,
            enableBasicAutocompletion: false,
            enableLiveAutocompletion: false,
            enableSnippets: false,
            showLineNumbers: true,
            tabSize: 2,
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
