import * as React from 'react';
import { useState } from 'react';
import { JSHINT } from 'jshint';

interface IProps {
  name: string;
  label?: string;
  onChange?: (json: Object) => Promise<any> | void;
  onError?: (err: any) => void;
}

const noop = () => {};

export const FakeJsonUpload = React.forwardRef((props: IProps, ref: any) => {
  const {
    name,
    label,
    onChange = noop,
    onError = noop,
  } = props;
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
      onError(err)
      setError('Invalid GeoJSON file')
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    const json = await file.text();
    handleJsonChange(json)
  }

  return (
    <>
      {label && <label className="ng-display-block" htmlFor={id}>{label}</label>}
      <input
        type="file"
        accept=".json,.geojson"
        id={id}
        name={name}
        onChange={handleUpload}
        ref={ref} />
      {error && (
        <div className="ng-form-error-block">{error}</div>
      )}
    </>
  )
});
