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

import SCENE_BACKGROUND from 'images/spinny-globe/background-min.png';
import OrbitControls from 'orbit-controls-es6';
import { PerspectiveCamera, Scene, TextureLoader, WebGLRenderer } from 'three';
import { CSS2DRenderer } from 'three-css2drender';

export default (rendererMount, renderer2dMount, props) => {
  const scene = new Scene();

  scene.background = new TextureLoader().load(SCENE_BACKGROUND);

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
