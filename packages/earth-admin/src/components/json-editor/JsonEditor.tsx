import * as React from 'react';
import { useState } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';

import 'codemirror/addon/lint/lint';
import 'codemirror/addon/lint/javascript-lint';
import 'codemirror/addon/lint/json-lint';
import 'codemirror/mode/javascript/javascript';

import './styles.scss';

interface JsonEditorProps {
  json?: {};
  onChange?: (data: string) => any;
  readOnly?: boolean;
}

export default function JsonEditor(props: JsonEditorProps) {
  const [jsonValue, setJsonValue] = useState('');

  const { json, onChange, readOnly } = props;

  const handleChange = (e, data, value) => {
    setJsonValue(value);
  };

  const handleBlur = () => {
    onChange && onChange(jsonValue);
  };

  return (
    <div className="ng-margin-medium-bottom" onBlur={handleBlur}>
      <CodeMirror
        value={JSON.stringify(json, null, 2)}
        options={{
          mode: 'javascript',
          json: true,
          theme: 'material-darker',
          gutters: ['CodeMirror-lint-markers'],
          lineNumbers: true,
          lint: true,
          lineWrapping: true,
          readOnly: readOnly,
        }}
        onChange={handleChange}
      />
    </div>
  );
}
