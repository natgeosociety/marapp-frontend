import { WebGLRenderer, Scene, PerspectiveCamera, TextureLoader } from 'three';

import { CSS2DRenderer } from 'three-css2drender';
import OrbitControls from 'orbit-controls-es6';

export default (rendererMount, renderer2dMount, props) => {
  const scene = new Scene();

  scene.background = new TextureLoader().load(
    `${process.env.REACT_APP_ASSETS_URL}/media/image/globe/background-min.png`
  );

  const camera = new PerspectiveCamera(50, 4 / 3, 0.5, 100);
  camera.position.set(0.0, 1.5, 3.0);

  // 3d renderer
  const renderer = new WebGLRenderer({ antialias: true });
  renderer.setClearColor('#000000');
  rendererMount.appendChild(renderer.domElement);

  // 2d renderer
  const renderer2d = new CSS2DRenderer();
  renderer2d.domElement.style.position = 'absolute';
  renderer2d.domElement.style.top = 0;
  renderer2dMount.appendChild(renderer2d.domElement);

  const { autoRotate, rotationSpeed } = props;

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.autoRotate = autoRotate;
  controls.autoRotateSpeed = rotationSpeed;
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.enableDamping = true;
  controls.minPolarAngle = 0.8;
  controls.maxPolarAngle = 2.4;
  controls.dampingFactor = 0.07;
  controls.rotateSpeed = 0.07;

  return {
    renderer,
    renderer2d,
    scene,
    camera,
    controls,
  };
};
