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

import {
  Mesh,
  SphereBufferGeometry,
  SphereGeometry,
  MeshPhongMaterial,
  // Utils
  Color,
  RepeatWrapping,
  TextureLoader,
} from 'three';

const TEXTURES = {
  globe: {
    map: new TextureLoader().load(
      `${process.env.REACT_APP_ASSETS_URL}/media/image/globe/equirectangular-basemap-02-min.png`
    ),
    bump: new TextureLoader().load(
      `${process.env.REACT_APP_ASSETS_URL}/media/image/globe/Earth_NormalNRM-minified.jpg`
    ),
    specular: new TextureLoader().load(
      `${process.env.REACT_APP_ASSETS_URL}/media/image/globe/Earth_Glossiness-minified.jpg`
    ),
  },
  clouds: new TextureLoader().load(
    `${process.env.REACT_APP_ASSETS_URL}/media/image/globe/fair_clouds-min.jpg`
  ),
  atmosphere: new TextureLoader().load(
    `${process.env.REACT_APP_ASSETS_URL}/media/image/globe/atsmosphere.png`
  ),
};

const createClouds = (radius, segments) => {
  return new Mesh(
    new SphereGeometry(radius + 0.01, segments, segments),
    new MeshPhongMaterial({
      transparent: true,
      alphaMap: TEXTURES.clouds,
      opacity: 0.8,
    })
  );
};

const createAtmosphere = (radius, segments) => {
  const tgeometry = new SphereBufferGeometry(radius + 0.02, segments, segments);
  const atmosphereAlpha = TEXTURES.atmosphere;

  // Dont touch this, this is making sure our atmosphere is correctly mapped around globe
  atmosphereAlpha.wrapS = RepeatWrapping;
  atmosphereAlpha.wrapT = RepeatWrapping;
  atmosphereAlpha.offset.set(0.24, -5);

  const tmaterial = new MeshPhongMaterial({
    color: '#478af7',
    opacity: 0.4,
    alphaTest: 0.3,
    transparent: true,
    alphaMap: atmosphereAlpha,
  });

  return new Mesh(tgeometry, tmaterial);
};

export default (stage, radius, segments) => {
  const { scene } = stage;
  const geometry = new SphereBufferGeometry(radius, segments, segments);

  const material = new MeshPhongMaterial({
    map: TEXTURES.globe.map,
    bumpMap: TEXTURES.globe.bump,
    bumpScale: 0.01,
    shininess: 5,
    specularMap: TEXTURES.globe.specular,
    specular: new Color('#bfd7ff'),
  });

  const atmosphere = createAtmosphere(radius, segments);
  const globe = new Mesh(geometry, material);
  const clouds = createClouds(radius, segments);

  scene.add(atmosphere, globe, clouds);

  return {
    globe,
    geometry,
    atmosphere,
    clouds,
  };
};
