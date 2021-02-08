import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import makeStyles from '@material-ui/core/styles/makeStyles';
import IconCircleSmall from 'mdi-material-ui/CircleSmall';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.grey['600'],
    borderTop: `1px solid ${theme.palette.grey['800']}`,
    '& button': {
      padding: theme.spacing(1, 2),
      justifyContent: 'flex-start',
      '& em span': {
        color: theme.palette.text.secondary,
      },
    },
  },
}));

interface IProps {
  onClick: () => void;
  location: string;
  organization: string;
}

const BackToLocation = ({ location, organization, onClick }: IProps) => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Button className="marapp-qa-backtolocation" fullWidth={true} onClick={onClick} size="small">
        <em>
          {t('Return to')} {location}
          <IconCircleSmall />
          <span>{organization}</span>
        </em>
      </Button>
    </div>
  );
};

export default BackToLocation;
