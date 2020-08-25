import * as React from 'react';
import { downloadFile } from 'utils';

interface DownloadFileProps {
  data: any;
  fileName: string
  children: React.ReactNode;
}

export const DownloadFile = (props: DownloadFileProps) => {
  const { data, fileName, children } = props;

  return (
    <a
      href={downloadFile(data)}
      download={`${fileName}.json`}
      className="ng-button ng-button-link ng-align-right ng-margin-top ng-text-transform-remove">
      {children}
    </a>
  )
};
