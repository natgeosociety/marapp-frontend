import React from 'react';
import { useTranslation } from 'react-i18next';

interface IProps {
  onClick: () => void;
  location: string;
  organization: string;
}

const BackToLocation = ({ location, organization, onClick }: IProps) => {
  const { t } = useTranslation();

  return (
    <div
      onClick={onClick}
      className="marapp-qa-backtolocation ng-c-cursor-pointer ng-padding-vertical ng-padding-medium-horizontal ng-ep-background-dark ng-ep-border-top"
    >
      <em className="ng-color-white">
        {t('Return to')} {location}
        <span className="ng-icon-bullet ng-margin-small-horizontal" />
        <span className="ng-color-mdgray">{organization}</span>
      </em>
    </div>
  );
};

export default BackToLocation;
