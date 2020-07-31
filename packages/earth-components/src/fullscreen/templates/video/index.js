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

import React, { Fragment, PureComponent } from "react";
import PropTypes from "prop-types";
import ReactPlayer from "react-player";

// Animations
import {Spring, Transition} from 'react-spring/renderprops'

import { Spinner } from "@marapp/earth-components";

import ShortDescription from "../short-description";

class Video extends PureComponent {
  static propTypes = {
    data: PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
      src: PropTypes.string,
    }),
    onClose: PropTypes.func,
  };

  state = {
    playing: true,
    fullDescription: false,
    loading: true,
    progress: 0,
  };

  onReady = () => {
    this.setState({ loading: false });
  };

  onError = () => {
    this.setState({ loading: false });
  };

  render() {
    const {
      data: { title, description, src },
      onClose,
    } = this.props;
    const { playing, loading, fullDescription } = this.state;

    return (
      <Fragment>
        <header className="fullscreen--header">
          <div className="fullscreen--header-content">
            {/* HEADER */}
            <Transition
              delay={750}
              from={{ y: 16, opacity: 0 }}
              enter={{ y: 0, opacity: 1 }}
              leave={{ y: -16, opacity: 0 }}
            >
              {() => ({ y, ...props }) => (
                <div
                  className="fullscreen--title"
                  style={{
                    transform: `translate(0, ${y}px)`,
                    ...props,
                  }}
                >
                  <h4>{title}</h4>
                  <ShortDescription
                    text={description}
                    fullDescription={fullDescription}
                    onToggleDescription={() =>
                      this.setState({ fullDescription: !fullDescription })
                    }
                  />
                </div>
              )}
            </Transition>

            {/* CLOSE BUTTON */}
            <Transition
              delay={500}
              from={{ opacity: 0, scale: 0.5 }}
              enter={{ opacity: 1, scale: 1 }}
              leave={{ opacity: 0, scale: 0.5 }}
            >
              {() => ({ scale, ...props }) => (
                <button
                  type="button"
                  className="fullscreen--close"
                  style={{
                    ...props,
                    transform: `scale(${scale}) translate(0, -50%)`,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                >
                  <i className="ng-icon-close" />
                </button>
              )}
            </Transition>
          </div>

          {/* full description */}
          {fullDescription && (
            <div className="fullscreen--full-description">
              <p className="-text">{description}</p>
            </div>
          )}
        </header>

        <div className="fullscreen--content">
          {loading && (
            <Spinner position="absolute" className="fullscreen--spinner" />
          )}

          <Spring delay={1000} from={{ opacity: 0 }} to={{ opacity: 1 }}>
            {(props) => (
              <div className="fullscreen--content-video" style={props}>
                <ReactPlayer
                  url={src}
                  playing={playing}
                  onReady={this.onReady}
                  onError={this.onError}
                  config={{
                    youtube: {
                      playerVars: {
                        controls: 0,
                        showinfo: 1,
                        rel: 0,
                      },
                    },
                  }}
                />
              </div>
            )}
          </Spring>
        </div>
      </Fragment>
    );
  }
}

export default Video;
