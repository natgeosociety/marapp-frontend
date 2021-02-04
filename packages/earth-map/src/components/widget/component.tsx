/*
  Copyright 2018-2020 National Geographic Society

  Use of this software does not constitute endorsement by National Geographic
  Society (NGS). The NGS name and NGS logo may not be used for any purpose without
  written permission from NGS.

  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at

      https://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed
  under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
  CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
*/
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import classnames from 'classnames';
import ToggleIcon from 'material-ui-toggle-icon';
import IconDown from 'mdi-material-ui/ChevronDown';
import IconUp from 'mdi-material-ui/ChevronUp';
import IconCircleSmall from 'mdi-material-ui/CircleSmall';
import React from 'react';
import isEqual from 'react-fast-compare';

import { Html } from '@marapp/earth-shared';

import { IWidgetConfig } from '../../modules/widget/model';
import Footer from './footer';
import './styles.scss';
import Toolbar from './toolbar';

interface IWidgetTemplate {
  id: number | string;
  className?: string;
  name: string;
  organization: string;
  subtitle?: string;
  color?: string;
  children?: any;
  url?: string;
  place?: any;
  description?: string;
  widgetDescription?: string;

  // Data
  config?: {};
  params?: {};
  parse?: (metric: any, params: any, widgetConfig: any, place: any) => void;
  metric?: {};
  layers?: [];
  widgetConfig?: IWidgetConfig;

  // States
  header?: boolean;
  toolbar?: boolean;
  footer?: boolean;
  embed?: boolean;
  box?: boolean;
  collapsed?: boolean;
  active?: boolean;
  showOrgLabel?: boolean;

  // Functions
  onCollapse?: () => {};
  onToggleLayer?: () => {};
  t?: (text: any, opt?: any) => string;
}

interface IWidgetState {
  loading?: boolean;
  loaded?: boolean;
  error?: any;
  classes?: any;

  // States
  activeInfo?: boolean;
  activeDownload?: boolean;
  activeShare?: boolean;
  expanded?: boolean;

  // DATA
  data?: any;
  params?: any;
  url?: string;
}

const styles = (theme) => ({
  root: {
    transition: theme.transitions.create('background', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    '&:hover': {
      background: theme.palette.action.hover,
    },
  },
  accordionTitle: {
    display: 'block',
    maxWidth: 'calc(100% - 36px)',
  },
  accordionTitleGridContainer: {
    minHeight: theme.spacing(7),
  },
  accordionTitleGridItem: {
    cursor: 'pointer',
    display: '-webkit-box',
    maxHeight: theme.spacing(7),
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    '-webkit-line-clamp': 2,
    '-webkit-box-orient': 'vertical',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  content: {
    marginTop: theme.spacing(2),
  },
  contentExpanded: {
    marginBottom: theme.spacing(3),
  },
});

class Widget extends React.PureComponent<IWidgetTemplate, IWidgetState> {
  public static defaultProps = {
    className: '',
    subtitle: '',
    config: {},
    params: {},
    parse: () => {},
    color: '#fff',
    header: true,
    toolbar: true,
    footer: true,
    embed: false,
    box: false,
    collapsed: false,

    active: false,
    activeInfo: false,
    activeShare: false,
    activeDownload: false,
    showOrgLabel: false,

    onCollapse: () => {},
    onToggleLayer: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      loaded: false,
      error: null,

      // States
      activeInfo: false,
      activeDownload: false,
      activeShare: false,
      expanded: true,

      // DATA
      data: {
        chart: [],
        template: '',
      },
    };
  }

  public componentDidMount() {
    this.fetchWidget();
  }

  public componentDidUpdate(prevProps) {
    const { params: prevParams } = prevProps;
    const { params: nextParams } = this.props;

    if (!isEqual(prevParams, nextParams)) {
      this.fetchWidget();
    }
  }

  public onInfo = () => {
    const { activeInfo } = this.state;

    this.setState({
      activeInfo: !activeInfo,
      activeDownload: false,
      activeShare: false,
    });
  };

  public onDownload = () => {
    const { activeDownload } = this.state;

    this.setState({
      activeInfo: false,
      activeDownload: !activeDownload,
      activeShare: false,
    });
  };

  public onShare = () => {
    const { activeShare } = this.state;

    this.setState({
      activeInfo: false,
      activeDownload: false,
      activeShare: !activeShare,
    });
  };

  public toggleExpanded = () => {
    const { expanded } = this.state;
    this.setState({ expanded: !expanded });
  };

  public fetchWidget = () => {
    const { config, name, parse, params, widgetConfig, place, metric = {}, t } = this.props;

    const newState: IWidgetState = { loading: false };

    try {
      if (!config) {
        return this.setState(newState);
      }

      newState.loaded = true;

      newState.data = parse(metric, params, widgetConfig, place);
    } catch (e) {
      newState.error = t('Failed to extract layer details', { value: name });
    } finally {
      this.setState({
        ...newState,
      });
    }
  };

  public onChangeParams = (params) => {
    this.setState({
      params: {
        ...this.state.params,
        ...params,
      },
    });
  };

  public render() {
    const {
      // GLOBAL
      id,
      embed,
      name,
      organization,
      subtitle,
      description,
      color,
      classes,
      className,
      children,
      widgetDescription,

      // STATES
      header,
      toolbar,
      footer,
      collapsed,
      box,
      active,
      showOrgLabel,

      // DATA
      params,
      metric,
      layers,
      // FUNCTIONS
      onCollapse,
      onToggleLayer,
      t,
    } = this.props;

    const {
      loading,
      loaded,
      error,

      activeInfo,
      activeShare,
      data,
      expanded,
    } = this.state;

    const classNames = classnames(classes.root, 'marapp-qa-widget c-widget ng-ep-border-bottom', {
      '-embed': embed,
      '-footer': footer,
      '-box': box,
      [className]: !!className,
    });

    if (typeof window === 'undefined') {
      return null;
    }

    return (
      <>
        <Box id={`widget-${id}`} className={classNames} p={2} pr={1}>
          <Grid
            container={true}
            alignItems="center"
            className={classes.accordionTitleGridContainer}
          >
            <Grid
              item={true}
              xs={true}
              onClick={this.toggleExpanded}
              className={classes.accordionTitleGridItem}
            >
              <Typography color="textPrimary" variant="subtitle1">
                {name}
                {showOrgLabel && (
                  <Typography component="span" color="textSecondary">
                    <IconCircleSmall />
                    {organization}
                  </Typography>
                )}
              </Typography>
            </Grid>

            {toolbar && (
              <Grid item={true} xs={false}>
                <Toolbar
                  className={className}
                  active={active}
                  activeInfo={activeInfo}
                  activeDownload={false}
                  activeShare={activeShare}
                  collapsed={!expanded}
                  onInfo={this.onInfo}
                  data={metric}
                  layers={layers}
                  onDownload={this.onDownload}
                  onShare={this.onShare}
                  onToggleLayer={onToggleLayer}
                />
              </Grid>
            )}

            <Divider flexItem={true} orientation="vertical" />

            <Grid item={true} xs={false}>
              <Box ml={0.5}>
                <IconButton onClick={this.toggleExpanded} className="marapp-qa-collapse-widget">
                  <ToggleIcon
                    on={!!expanded}
                    onIcon={<IconUp fontSize="small" />}
                    offIcon={<IconDown fontSize="small" />}
                  />
                </IconButton>
              </Box>
            </Grid>
          </Grid>

          {subtitle && (
            <h4 className="widget--subtitle">
              <em>{subtitle}</em>
            </h4>
          )}

          {error && (
            <div className="marapp-qa-widget-config-error ng-form-error-block">{t(error)}</div>
          )}

          {/* CONTENT || INFO */}

          <div
            className={`${classes.content} ${
              expanded ? classes.contentExpanded : ''
            } translate-content`}
          >
            {children({
              ...this.props,
              ...data,
              expanded,
              loading,
              loaded,
              error,
              params,
              onChangeParams: this.onChangeParams,
            })}
          </div>

          {/* FOOTER */}
          {!!layers?.length && footer && (
            <Footer active={active} expanded={expanded} onToggleLayer={onToggleLayer} />
          )}
        </Box>

        <Dialog
          open={!!activeInfo}
          onClose={() => this.setState({ activeInfo: !activeInfo })}
          className="marapp-qa-widget-info-modal"
        >
          <DialogTitle>{name}</DialogTitle>

          {widgetDescription && (
            <DialogContent>
              <Html html={widgetDescription} className="widget--info translate-content" />
            </DialogContent>
          )}

          <DialogActions>
            <Button
              size="large"
              className="marapp-qa-modalclose"
              onClick={() => this.setState({ activeInfo: !activeInfo })}
            >
              {t('Close')}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}

export default withStyles(styles)(Widget);
