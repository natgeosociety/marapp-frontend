import makeStyles from '@material-ui/core/styles/makeStyles';
import MuiMenu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { bindMenu } from 'material-ui-popup-state/hooks';
import React from 'react';

interface IMenuOption {
  label: string | React.ReactNode;
  onClick?: (arg?: any) => any;
  disableCloseOnOptionClick?: boolean;
  [any: string]: any;
}

interface IProps {
  anchorOrigin?: any;
  className?: string;
  transformOrigin?: any;
  popupState?: any;
  options?: IMenuOption[];
  [any: string]: any;
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.grey['600'],
  },
}));

export const Menu = React.forwardRef((props: IProps, ref: any) => {
  const {
    className,
    popupState,
    options,
    anchorOrigin = {
      vertical: 'bottom',
      horizontal: 'right',
    },
    transformOrigin = {
      vertical: 'top',
      horizontal: 'right',
    },
    ...rest
  } = props;
  const classes = useStyles();

  return (
    <MuiMenu
      {...bindMenu(popupState)}
      className={`${className} marapp-qa-dropdown marapp-qa-dropdown-${popupState.popupId}`}
      anchorOrigin={anchorOrigin}
      getContentAnchorEl={null}
      transformOrigin={transformOrigin}
      classes={{
        ...rest.classes,
        paper: `${classes.root} ${rest?.classes?.paper}`,
      }}
      {...rest}
    >
      {options?.map((option, index) => {
        const { disableCloseOnOptionClick, label, onClick, ...rest } = option;

        return (
          <MenuItem
            key={index}
            onClick={(ev) => {
              !disableCloseOnOptionClick && popupState.close();

              onClick && onClick(ev);
            }}
            {...rest}
          >
            {label}
          </MenuItem>
        );
      })}
    </MuiMenu>
  );
});
