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

import React, { Fragment, PureComponent } from 'react';
import classnames from 'classnames';

// Animations
import { Transition } from 'react-spring/renderprops.cjs';

import { Spinner, Slick, SlickNextArrow, SlickPrevArrow } from '@marapp/earth-shared';

import ShortDescription from '../short-description/ShortDescription';

interface PhotoProps {
  data: { title: string; description: string; files: any };
  onClose?: () => {};
}

interface PhotoState {
  index: number;
  fullDescription: boolean;
  loading: boolean;
}

class Photo extends PureComponent<PhotoProps, PhotoState> {
  state = {
    index: 0,
    fullDescription: false,
    loading: true,
  };
  private timeout: any;
  private slider: any;
  private sliderThumb: any;

  componentWillMount() {
    const { data } = this.props;
    const { files } = data;
    let loaded = 0;

    if (!files.length) {
      this.timeout = setTimeout(() => this.setState({ loading: false }), 500);
    }

    // Preload images
    files.forEach((f: any) => {
      const image = new Image();
      image.src = f.src;
      image.onload = () => {
        loaded = loaded + 1;

        if (loaded === files.length) {
          this.timeout = setTimeout(() => this.setState({ loading: false }), 500);
        }
      };
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { index } = this.state;
    const { index: prevIndex } = prevState;

    if (index !== prevIndex) {
      this.slider.slickGoTo(index);
      this.sliderThumb.slickGoTo(index);
    }
  }

  componentWillUnmount() {
    if (this.timeout) clearTimeout(this.timeout);
  }

  render() {
    const { data, onClose } = this.props;
    const { files } = data;
    const { index, loading, fullDescription } = this.state;

    const settings = {
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      nextArrow: <SlickNextArrow />,
      prevArrow: <SlickPrevArrow />,
      beforeChange: (oldIndex, newIndex) => {
        this.setState({ index: newIndex });
      },
    };

    const thumbLength = files.length > 3 ? 4 : files.length;
    const settingsThumb = {
      infinite: true,
      arrows: false,
      speed: 500,
      centerMode: false,
      slidesToShow: thumbLength,
      slidesToScroll: 1,
    };

    return (
      <Fragment>
        <header className="fullscreen--header">
          <div className="fullscreen--header-content">
            {/* HEADER */}
            <Transition
              delay={250}
              items={!loading}
              from={{ y: 16, opacity: 0 }}
              enter={{ y: 0, opacity: 1 }}
              leave={{ y: -16, opacity: 0 }}
            >
              {(loaded) =>
                loaded &&
                (({ y, ...props }) => (
                  <div
                    className="fullscreen--title"
                    style={{
                      transform: `translate(0, ${y}px)`,
                      ...props,
                    }}
                  >
                    <h4>{files[index].title}</h4>
                    <ShortDescription
                      text={files[index].description}
                      fullDescription={fullDescription}
                      onToggleDescription={() =>
                        this.setState({ fullDescription: !fullDescription })
                      }
                    />
                  </div>
                ))
              }
            </Transition>

            {/* THUMBNAILS */}
            {files.length > 1 && (
              <Transition
                delay={250}
                items={!loading}
                from={{ y: 16, opacity: 0 }}
                enter={{ y: 0, opacity: 1 }}
                leave={{ y: -16, opacity: 0 }}
              >
                {(loaded) =>
                  loaded &&
                  (({ y, ...props }) => (
                    <div
                      className="fullscreen--thumbnails"
                      style={{
                        transform: `translate(0, ${y}px)`,
                        ...props,
                      }}
                    >
                      <div
                        style={{
                          width: 50 * thumbLength + (8 * thumbLength - 1),
                        }}
                      >
                        <Slick
                          settings={settingsThumb}
                          onReady={(slider) => {
                            this.sliderThumb = slider;
                          }}
                        >
                          {files.map((image, i) => (
                            <div key={image.id} className="thumbnails--item">
                              <div
                                role="button"
                                tabIndex={-1}
                                className={classnames({
                                  'thumbnails--button': true,
                                  '-active': index === i,
                                })}
                                onClick={() => this.setState({ index: i })}
                                style={{
                                  backgroundImage: `url(${image.src})`,
                                  backgroundSize: 'cover',
                                  height: 50,
                                  width: 50,
                                }}
                              />
                            </div>
                          ))}
                        </Slick>
                      </div>
                    </div>
                  ))
                }
              </Transition>
            )}

            {/* CLOSE BUTTON */}
            {/* @ts-ignore*/}
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
              <p className="-text">{files[index].description}</p>
            </div>
          )}
        </header>

        {/* SLICK CAROUSEL */}
        <div className="fullscreen--content fullscreen--content-image">
          {/* @ts-ignore*/}
          {loading && <Spinner position="absolute" className="fullscreen--spinner" />}

          <Transition
            delay={1000}
            items={!loading}
            from={{ opacity: 0 }}
            enter={{ opacity: 1 }}
            leave={{ opacity: 0 }}
          >
            {(loaded) =>
              loaded &&
              ((props) => (
                <div className="fullscreen-image--list" style={props}>
                  <Slick
                    settings={settings}
                    onReady={(slider) => {
                      this.slider = slider;
                    }}
                  >
                    {files.map((image, i) => (
                      <div key={image.id}>
                        <div className="fullscreen-image--list-item">
                          <img src={files[i].src} alt={files[i].title} />
                        </div>
                      </div>
                    ))}
                  </Slick>
                </div>
              ))
            }
          </Transition>
        </div>
      </Fragment>
    );
  }
}

export default Photo;
