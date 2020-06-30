import React from 'react';

import { Tooltip } from 'vizzuality-components';

interface IMetric {
  data: { metric: {}; slug: string };
}

const WidgetDownload = (props: IMetric) => {
  const {
    data: { metric, slug },
  } = props;

  const stringifiedMetric = JSON.stringify(metric);
  const jsonBlob = new Blob([stringifiedMetric]);
  const blobUrl = URL.createObjectURL(jsonBlob);

  return (
    <div>
      <Tooltip
        placement="top"
        overlay={<span>Download</span>}
        overlayClassName="c-rc-tooltip -default"
        mouseLeaveDelay={0}
      >
        <a href={blobUrl} download={`${slug}.json`} className="ng-border-remove">
          <i className="ng-icon-download-circle" />
        </a>
      </Tooltip>
    </div>
  );
};

export default WidgetDownload;
