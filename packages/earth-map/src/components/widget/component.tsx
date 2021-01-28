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
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import classnames from 'classnames';
import IconDown from 'mdi-material-ui/ChevronDown';
import React from 'react';
import isEqual from 'react-fast-compare';

import { Html, Spinner } from '@marapp/earth-shared';

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
  accordionTitle: {
    maxWidth: 'calc(100% - 36px)',
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

    const classNames = classnames('marapp-qa-widget c-widget ng-ep-border-bottom', {
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
        <Accordion
          id={`widget-${id}`}
          className={classNames}
          defaultExpanded={true}
          expanded={expanded}
        >
          <AccordionSummary
            classes={{
              content: expanded ? '' : classes.accordionTitle,
            }}
            expandIcon={<IconDown onClick={this.toggleExpanded} />}
          >
            <Grid alignItems="center" container={true}>
              <Grid
                item={true}
                xs={true}
                onClick={this.toggleExpanded}
                style={{ overflow: 'hidden' }}
              >
                <Typography color="textPrimary" variant="subtitle1" noWrap={!expanded}>
                  {name} {showOrgLabel && ` - ${organization}`}
                </Typography>

                {!expanded && data?.template && (
                  <Typography
                    color="textSecondary"
                    variant="body2"
                    dangerouslySetInnerHTML={{
                      __html: data?.template,
                    }}
                  />
                )}
              </Grid>

              {toolbar && (
                <Grid xs={false}>
                  <Toolbar
                    className={className}
                    activeInfo={activeInfo}
                    activeDownload={false}
                    activeShare={activeShare}
                    onInfo={this.onInfo}
                    data={metric}
                    onDownload={this.onDownload}
                    onShare={this.onShare}
                  />
                </Grid>
              )}

              <Divider flexItem={true} orientation="vertical" />
            </Grid>
          </AccordionSummary>
          <AccordionDetails>
            <div>
              {subtitle && (
                <h4 className="widget--subtitle">
                  <em>{subtitle}</em>
                </h4>
              )}

              {error && (
                <div className="marapp-qa-widget-config-error ng-form-error-block">{t(error)}</div>
              )}

              {/* CONTENT || INFO */}

              <div className="widget--content ng-margin-large-bottom translate-content">
                {children({
                  ...this.props,
                  ...data,
                  loading,
                  loaded,
                  error,
                  params,
                  onChangeParams: this.onChangeParams,
                })}
              </div>

              {/* FOOTER */}
              {!!layers?.length && footer && (
                <Footer
                  collapsed={collapsed}
                  active={active}
                  color={color}
                  onCollapse={onCollapse}
                  onToggleLayer={onToggleLayer}
                />
              )}
            </div>
          </AccordionDetails>
        </Accordion>

        <Dialog open={!!activeInfo} onClose={() => this.setState({ activeInfo: !activeInfo })}>
          <DialogTitle>{name}</DialogTitle>

          {widgetDescription && (
            <DialogContent>
              <Html html={widgetDescription} className="widget--info translate-content" />
            </DialogContent>
          )}

          <DialogActions>
            <Button size="large" onClick={() => this.setState({ activeInfo: !activeInfo })}>
              {t('Close')}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}

export default withStyles(styles)(Widget);
