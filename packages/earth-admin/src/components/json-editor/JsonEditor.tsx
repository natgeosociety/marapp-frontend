/*
  Copyright 2018-2020 National Geographic Society

  Use of this software does not constitute endorsement by National Geographic
  Society (NGS). The NGS name and NGS logo may not be used for any purpose without
  written permission from NGS.

  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at

      https://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed
  under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
  CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
*/

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
    <div className="marapp-qa-jsoneditor ng-margin-medium-bottom" onBlur={handleBlur}>
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
