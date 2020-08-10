import * as React from 'react';

import { InlineCardProps } from '../InlineCard';

type InlineCardButtonsProps = Partial<InlineCardProps>;


const InlineCardButtons = ( props: Partial<InlineCardButtonsProps> ) => {
  const { primaryButtonText, secondaryButtonText, editAction, saveAction } = props;

  const handleEdit = () => {
    editAction(false);
  };

  const handleSave = () => {
    saveAction(false);
  };

  return (<>
    {primaryButtonText && <button className="ng-button ng-button-primary ng-margin-right"
                                  onClick={handleSave}>{primaryButtonText}</button>}
    {secondaryButtonText &&
    <button className="ng-button ng-button-secondary" onClick={handleEdit}>{secondaryButtonText}</button>}
  </>);
};

export default InlineCardButtons;
