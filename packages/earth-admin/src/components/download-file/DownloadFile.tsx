import classnames from 'classnames';
import React from 'react';

import { downloadJSONFile } from '@marapp/earth-shared';

interface DownloadFileProps {
  data: any;
  fileName: string;
  type: string;
  children: React.ReactNode;
  className?: string;
}

export const DownloadFile = (props: DownloadFileProps) => {
  const { data, fileName, type, children, className } = props;

  const blobUrl = downloadJSONFile(data);

  return (
    <a
      href={blobUrl}
      download={`${fileName}.${type}`}
      className={classnames(
        'marapp-qa-downloadfile ng-button ng-button-link ng-text-transform-remove',
        className
      )}
    >
      {children}
    </a>
  );
};
