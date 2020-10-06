import classnames from 'classnames';
import React from 'react';

import { downloadJSONFile } from '@marapp/earth-shared';

interface DownloadFileProps {
  data: any;
  fileName: string;
  children: React.ReactNode;
  className?: string;
}

export const DownloadFile = (props: DownloadFileProps) => {
  const { data, fileName, children, className } = props;

  const blobUrl = downloadJSONFile(data);

  return (
    <a
      href={blobUrl}
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
