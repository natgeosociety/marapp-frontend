import grayscale from './images/layers/grayscale.png';
import satellite from './images/layers/satellite.png';

export const APP_NAME = process.env.REACT_APP_NAME;
export const APP_LOGO = require('images/marapp.svg');

export const APP_BASEMAPS = [
  {
    slug: 'grayscale',
    name: 'Grayscale',
    background: grayscale,
    id: 'mapbox://styles/ngsmapbox-gf/ckbwix5xv165q1htdbvkrmxug',
  },
  {
    slug: 'satellite',
    name: 'Satellite',
    background: satellite,
    id: 'mapbox://styles/mapbox/satellite-streets-v11',
  },
];

export const APP_ABOUT = 'https://github.com/natgeosociety/marapp-frontend/blob/master/ABOUT.md';
