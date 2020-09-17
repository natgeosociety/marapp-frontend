import classnames from 'classnames';
import React from 'react';

import { downloadFile } from '@app/utils';

interface DownloadFileProps {
  data: any;
  fileName: string;
  children: React.ReactNode;
  className?: string;
}

export const DownloadFile = (props: DownloadFileProps) => {
  const { data, fileName, children, className } = props;

  return (
    <a
      href={downloadFile(data)}
      download={`${fileName}.json`}
      className={classnames(
        'marapp-qa-downloadfile ng-button ng-button-link ng-text-transform-remove',
        className
      )}
    >
      {children}
    </a>
  );
};
