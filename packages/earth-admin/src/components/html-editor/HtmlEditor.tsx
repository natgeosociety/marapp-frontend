import * as React from 'react';

import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import './styles.scss';

interface HtmlEditorProps {
  html?: string;
  onChange?: (data: string) => void;
}

export default function HtmlEditor(props: HtmlEditorProps) {
  const { html, onChange } = props;

  const handleHtmlChange = (editor) => {
    const data = editor.getData();
    onChange && onChange(data);
  };

  return (
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
  );
}
