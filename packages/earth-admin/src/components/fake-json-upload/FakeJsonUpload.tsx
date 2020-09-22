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

import { JSHINT } from 'jshint';
import { noop } from 'lodash';
import React, { useState } from 'react';

interface IProps {
  name: string;
  label?: string;
  onChange?: (json: Object) => Promise<any> | void;
  onError?: (err: any) => void;
}

export const FakeJsonUpload = React.forwardRef((props: IProps, ref: any) => {
  const { name, label, onChange = noop, onError = noop } = props;
  const [error, setError] = useState('');
  const id = `input-${name}`;

  const handleJsonChange = (json) => {
    try {
      const parsedJson = JSON.parse(json);
      if (!JSHINT.errors) {
        onChange(parsedJson);
        setError('');
      }
    } catch (err) {
      onError(err);
      setError('Invalid GeoJSON file');
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    const json = await file.text();
    handleJsonChange(json);
  };

  return (
    <div className="marapp-qa-fakejsonupload ng-flex-inline ng-flex-column">
      {label && <label htmlFor={id}>{label}</label>}
      <input
        type="file"
        accept=".json,.geojson"
        id={id}
        name={name}
        onChange={handleUpload}
        ref={ref}
      />
      {error && <div className="ng-form-error-block">{error}</div>}
    </div>
  );
});
