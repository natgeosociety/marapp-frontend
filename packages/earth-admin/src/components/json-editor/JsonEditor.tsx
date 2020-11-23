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

import 'codemirror/mode/javascript/javascript';
import React, { useState } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import jsonlint from 'jsonlint';

import './styles.scss';

interface JsonEditorProps {
  json?: {};
  onChange?: (data: string) => any;
  readOnly?: boolean;
  onError?: (err: boolean) => any;
}

export const JsonEditor = (props: JsonEditorProps) => {
  const [error, setError] = useState('');
  const { json, onChange, readOnly, onError } = props;

  function makeMarker() {
    const marker = typeof document !== `undefined` ? document.createElement('div') : null;
    marker.style.color = '#FC4349';
    marker.innerHTML = '●';
    return marker;
  }

  const handleBlur = (e) => {
    const json = e.getValue();

    e.clearGutter('error-gutter');

    try {
      if (json) {
        const parsedJson = jsonlint.parse(json);
        onChange && onChange(parsedJson);
        onError && onError(false);

        setError('');
      }
    } catch (err) {
      const error = err.message.split(':')[0];
      const errorLine = parseInt(error.match(/\d+/gi).join('')) - 1;
      e.setGutterMarker(errorLine, 'error-gutter', makeMarker());
      setError(error);
      onError && onError(true);
    }
  };

  return (
    <div className="marapp-qa-jsoneditor">
      <CodeMirror
        value={json ? JSON.stringify(json, null, 2) : null}
        options={{
          mode: 'javascript',
          json: true,
          theme: 'material-darker',
          gutters: ['CodeMirror-lint-markers', 'error-gutter'],
          lineNumbers: true,
          lineWrapping: true,
          readOnly,
        }}
        onBlur={handleBlur}
      />
      {error && <div className="ng-form-error-block">{error}</div>}
    </div>
  );
};
