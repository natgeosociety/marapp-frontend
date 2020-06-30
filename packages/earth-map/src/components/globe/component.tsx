import * as React from 'react';

import classNames from 'classnames';

import createStage from './webgl/stage';
import lightScene from './webgl/lights';
import prepareGlobe from './webgl/globe';

import './styles.scss';

const segments = 32;

interface IGlobe {
  visible?: boolean;
  radius?: number;
  autoRotate?: boolean;
  rotationSpeed?: number;
  presentationMode?: boolean;
  styles?: {};
  children?: any;
}

class GlobeComponent extends React.Component<IGlobe, any> {
  static defaultProps = {
    visible: false,
    radius: 1.0,
    rotationSpeed: -0.05,
    autoRotate: true,
    presentationMode: true,
    styles: {},
  };
  private rendererMount: any;
  private renderer2dMount: any;
  private stage: any;
  private earth: any;
  private lights: any;
  private animationId: any;
  private container: any;
  private originalYPos: number;

  constructor(props) {
    super(props);
    this.rendererMount = null;
    this.renderer2dMount = null;

    this.stage = null;
    this.earth = null;
    this.lights = null;

    this.animationId = null;

    this.animate = this.animate.bind(this);

    this.state = {
      animationEnabled: true,
    };
  }

  componentDidMount() {
    const { radius } = this.props;

    this.stage = createStage(this.rendererMount, this.renderer2dMount, this.props);
    this.earth = prepareGlobe(this.stage, radius, segments);
    this.lights = lightScene(this.stage, this.earth, radius, segments);

    this.originalYPos = this.earth.globe.position.x;

    // Events
    window.addEventListener('resize', this.onResize);
    this.onResize();

    this.setVisibility(0);
  }

  componentDidUpdate(prevProps) {
    const { visible } = this.props;
    const { visible: prevVisible } = prevProps;

    if (visible !== prevVisible) {
      this.setVisibility(visible ? 750 : 0);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
    cancelAnimationFrame(this.animationId);
  }

  setVisibility = delay => {
    const { visible } = this.props;
    const { scene } = this.stage;

    setTimeout(() => {
      scene.visible = visible;

      if (!visible) {
        this.renderScene();
        cancelAnimationFrame(this.animationId);
      } else {
        this.animate();
      }
    }, delay);
  };

  animate() {
    const { presentationMode, autoRotate } = this.props;

    const { controls, camera } = this.stage;
    const { atmosphere } = this.earth;
    const { backlight, lightTracker, direcitonal, topLight, ambient } = this.lights;

    controls.autoRotate = autoRotate;
    controls.update();

    this.renderScene();

    if (presentationMode && topLight.intensity < 1.2) {
      topLight.intensity = topLight.intensity += 0.01;
    } else if (!presentationMode && topLight.intensity > 0) {
      topLight.intensity = topLight.intensity -= 0.01;
    }

    if (presentationMode && ambient.intensity > 0) {
      ambient.intensity = ambient.intensity -= 0.01;
    } else if (!presentationMode && ambient.intensity < 0.5) {
      ambient.intensity = ambient.intensity += 0.01;
    }

    if (presentationMode && backlight.intensity > 0) {
      backlight.intensity = backlight.intensity -= 0.04;
    } else if (!presentationMode && backlight.intensity < 0.5) {
      backlight.intensity = backlight.intensity += 0.04;
    }

    if (presentationMode && direcitonal.intensity > 0) {
      direcitonal.intensity = direcitonal.intensity -= 0.01;
    } else if (!presentationMode && direcitonal.intensity < 0.9) {
      direcitonal.intensity = direcitonal.intensity += 0.01;
    }

    if (presentationMode && camera.fov > 40) {
      camera.fov -= 0.06;
      camera.position.y += 0.002;
      camera.position.x -= 0.002;
      camera.position.z += 0.002;
      camera.updateProjectionMatrix();
    } else if (!presentationMode && camera.fov < 45) {
      camera.fov += 0.05;
      camera.position.y -= 0.002;
      camera.position.x += 0.002;
      camera.position.z -= 0.002;
      camera.updateProjectionMatrix();
    }

    // Light tracker creates dymanic ligthning as you move around the globe
    const direction = lightTracker.position
      .clone()
      .sub(camera.position)
      .normalize();
    lightTracker.position.copy(direction.clone().multiplyScalar(100));

    backlight.position.copy(lightTracker.position.clone());
    direcitonal.position.copy(camera.position);
    atmosphere.lookAt(camera.position);

    this.animationId = requestAnimationFrame(this.animate);
  }

  renderScene = () => {
    const { renderer, renderer2d, scene, camera } = this.stage;
    renderer.render(scene, camera);
    renderer2d.render(scene, camera);
  };

  onResize = () => {
    const { camera, renderer, renderer2d } = this.stage;

    camera.aspect = this.container.offsetWidth / this.container.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
    renderer2d.setSize(this.container.offsetWidth, this.container.offsetHeight);
  };

  render() {
    const { presentationMode, styles } = this.props;

    return (
      <div
        ref={r => {
          this.container = r;
        }}
        className={classNames({
          'c-globe': true,
          '-presentation': presentationMode,
        })}
        style={styles}
      >
        {/* 2d assets */}
        <div
          ref={mount => {
            this.renderer2dMount = mount;
          }}
        />

        {/* globe */}
        <div
          style={{
            width: '100%',
            height: '100vh',
            position: 'fixed',
            top: 0,
            left: 0,
          }}
          ref={mount => {
            this.rendererMount = mount;
          }}
        />
      </div>
    );
  }
}

export default GlobeComponent;
