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

import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import '@ckeditor/ckeditor5-build-classic/build/translations/fr';
import '@ckeditor/ckeditor5-build-classic/build/translations/es';
import CKEditor from '@ckeditor/ckeditor5-react';
import React from 'react';

import './styles.scss';
import { useTranslation } from 'react-i18next';

interface HtmlEditorProps {
  html?: string;
  onChange?: (data: string) => void;
  className?: string;
}

export default function HtmlEditor(props: HtmlEditorProps) {
  const { html, onChange, className } = props;
  const { i18n } = useTranslation('admin');

  const handleHtmlChange = (editor) => {
    const data = editor.getData();
    onChange && onChange(data);
  };

  return (
    <div className={className}>
      <CKEditor
        editor={ClassicEditor}
        data={html}
        config={{
          toolbar: [
            'heading',
            '|',
            'bold',
            'italic',
            'link',
            'bulletedList',
            'numberedList',
            'blockQuote',
          ],
          language: i18n.language,
          heading: {
            options: [
              { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
              { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
              { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
              { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
              { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
              { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
              { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' },
            ],
          },
        }}
        onBlur={(event, editor) => handleHtmlChange(editor)}
      />
    </div>
  );
}
