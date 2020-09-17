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

export const media = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [14.7877522899587, -12.45770794190453],
      },
      properties: {
        type: 'photo',
        files: [
          {
            id: 1,
            title: 'The expedition team',
            description: 'Warming up after a cold night in the wilderness.',
            src: '/file.jpg',
          },
          {
            id: 2,
            title: 'The expedition team',
            description: 'Preparing mokoro canoes for their journey down the Okavago.',
            src: '/file.jpg',
          },
        ],
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [14.7577522899587, -12.35770794190453],
      },
      properties: {
        type: 'video',
        title: 'testing',
        description: 'testing description',
        src: '/file.mov',
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [14.7877522899587, -12.48770794190453],
      },
      properties: {
        type: 'audio',
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [14.7977522899587, -12.49770794190453],
      },
      properties: {
        type: 'photo',
        files: [
          {
            id: 3,
            title: 'The expedition team',
            description: 'Transporting scientific equipment down the river.',
            src: '/file.jpg',
          },
        ],
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [14.8277522899587, -12.47070794190453],
      },
      properties: {
        type: '360',
        files: [
          {
            id: 3,
            title: 'The expedition team',
            description: 'Transporting scientific equipment down the river.',
            src: '/file.jpg',
          },
        ],
      },
    },
  ],
};

export default {
  media,
};
