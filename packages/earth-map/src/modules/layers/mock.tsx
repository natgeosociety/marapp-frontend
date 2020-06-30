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
            src:
              '/file.jpg',
          },
          {
            id: 2,
            title: 'The expedition team',
            description: 'Preparing mokoro canoes for their journey down the Okavago.',
            src:
              '/file.jpg',
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
        src:
          '/file.mov',
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
            src:
              '/file.jpg',
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
            src:
              '/file.jpg',
          },
        ],
      },
    },
  ],
};

export default {
  media,
};
