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

import classnames from 'classnames';
import ModalComponent from 'components/modal';
import { IWidgetConfig } from 'modules/widget/model';
import React from 'react';
import isEqual from 'react-fast-compare';

import { Html, Spinner } from '@marapp/earth-shared';

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

  // States
  activeInfo?: boolean;
  activeDownload?: boolean;
  activeShare?: boolean;

  // DATA
  data?: any;
  params?: any;
  url?: string;
}

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
      <div id={`widget-${id}`} className={classNames}>
        {/* Spinner */}
        {loading && <Spinner size="medium" />}

        <div className="widget--container ng-padding-large-vertical ng-padding-medium-horizontal">
          {/* HEADER */}
          {header && (
            <header className="ng-flex ng-flex-middle ng-flex-space-between ng-padding-medium-bottom">
              <div className="widget--header-title">
                <h4 className="ng-text-display-s ng-body-color ng-margin-remove">
                  {showOrgLabel && `${organization} -`} {name}
                </h4>

                {subtitle && (
                  <h4 className="widget--subtitle">
                    <em>{subtitle}</em>
                  </h4>
                )}
              </div>

              {toolbar && (
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
              )}
            </header>
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

        <ModalComponent
          isOpen={activeInfo}
          onRequestClose={() => this.setState({ activeInfo: !activeInfo })}
        >
          <h3 className="ng-text-display-m ng-body-color">{name}</h3>
          {widgetDescription && (
            <Html html={widgetDescription} className="widget--info translate-content" />
          )}
        </ModalComponent>
      </div>
    );
  }
}

export default Widget;
