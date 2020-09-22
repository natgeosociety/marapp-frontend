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

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Iframe
import ReactIframeResizer from 'react-iframe-resizer-super';

// Components
import { Button } from '@marapp/earth-shared';

// Styles
import './styles.scss';

class ShareComponent extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    link: PropTypes.string,
    embed: PropTypes.string,
    className: PropTypes.string,
  };

  static defaultProps = {
    title: '',
    link: '',
    embed: '',
    className: '',
  };

  constructor(props) {
    super(props);

    this.state = {
      tab: this.getDefaultTab(props),
      copied: false,
      width: '100%',
      height: '500px',
    };
  }

  getDefaultTab(props) {
    const { link, embed } = props;
    if (typeof link !== 'undefined') return 'link';
    if (typeof link === 'undefined' && typeof embed !== 'undefined') return 'embed';
    return 'link';
  }

  /**
   * - onCopy
   * @return
   */
  onCopy = () => {
    const { input } = this;
    input.select();

    try {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }

      document.execCommand('copy');

      this.setState({ copied: true });

      // this.props.analytics.copy(type);

      this.timeout = setTimeout(() => {
        this.setState({ copied: false });
      }, 1000);
    } catch (err) {
      console.error('Oops, unable to copy');
    }
  };

  render() {
    const { title, link, embed, className } = this.props;

    const { tab, width, height, copied } = this.state;

    const classNames = classnames('marapp-qa-share', 'c-share', {
      [className]: !!className,
    });

    return (
      <div className={classNames}>
        {title && <h2>{title}</h2>}

        {link && embed && (
          <div className="share--tabs">
            <button
              className={classnames({
                'share--tabs-item': true,
                '-active': tab === 'link',
              })}
              type="button"
              onClick={() => {
                this.setState({ tab: 'link' });
              }}
            >
              <h4>link</h4>
            </button>

            <button
              className={classnames({
                'share--tabs-item': true,
                '-active': tab === 'embed',
              })}
              type="button"
              onClick={() => {
                this.setState({ tab: 'embed' });
              }}
            >
              <h4>embed</h4>
            </button>
          </div>
        )}

        {tab === 'link' && (
          <div className="share--container">
            <div className="c-field">
              <div className="share-input-container">
                <input
                  ref={(n) => {
                    this.input = n;
                  }}
                  id="share-link"
                  name="share-link"
                  className="share-input"
                  value={link}
                  readOnly
                />

                <div className="share-buttons">
                  <Button className="-light -small -fullwidth -fullheight" onClick={this.onCopy}>
                    <h4>{copied ? 'Copied' : 'Copy link'}</h4>
                  </Button>
                </div>
              </div>
            </div>

            <div className="share--social">
              <a
                className="share--social-button"
                href={`http://www.facebook.com/sharer/sharer.php?u=${link}`}
                target="_blank"
                rel="noopener noreferrer"
              ></a>

              <a
                className="share--social-button"
                href={`https://twitter.com/share?url=${link}&text=${encodeURIComponent(
                  document.title
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              ></a>
            </div>
          </div>
        )}

        {tab === 'embed' && (
          <div className="share--container">
            <div className="c-field">
              <div className="share-input-container">
                <input
                  ref={(n) => {
                    this.input = n;
                  }}
                  id="share-embed"
                  name="share-embed"
                  className="share-input"
                  value={`<iframe src="${embed}" width="${width}" height="${height}" frameBorder="0" />`}
                  readOnly
                />

                <div className="share-buttons">
                  <Button className="-light -small -fullwidth -fullheight" onClick={this.onCopy}>
                    <h4>{copied ? 'Copied' : 'Copy code'}</h4>
                  </Button>
                </div>
              </div>
            </div>

            <ReactIframeResizer
              title="widget-preview"
              src={embed}
              frameBorder={0}
              style={{
                width: '100%',
                minHeight: 350,
                border: '1px solid #CCC',
              }}
              iframeResizerOptions={{
                checkOrigin: false,
                log: false,
                resizedCallback: ({ height: h, width: w }) => {
                  this.setState({ height: `${h}px`, width: `${w}px` });
                },
              }}
            />
          </div>
        )}
      </div>
    );
  }
}

export default ShareComponent;
