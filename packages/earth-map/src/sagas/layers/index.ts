import {all, put, call, select} from 'redux-saga/effects';
import {replace} from 'redux-first-router';
import sortBy from 'lodash/sortBy';

import {fetchDataIndexes} from 'services/data-indexes';
import {DATA_INDEX_QUERY} from '../model';
import {IIndex} from 'modules/indexes/model';
import {ILayer} from 'modules/layers/model';
import {IWidget} from 'modules/widget/model';
import {setWidgets, setWidgetsLoading, setWidgetsError} from 'modules/widgets/actions';
import {setIndexesList} from 'modules/indexes/actions';
import {setLayersList} from 'modules/layers/actions';
import {getGroup} from 'sagas/saga-utils';

const LAYERS = [
  {

    'id': '4adc9b7b-37be-442c-b90f-18aa9abe7f76',
    'slug': 'aqueduct-baseline-water-stress',
    'name': 'Aqueduct Baseline Water Stress',
    'type': 'vector',
    'provider': 'cartodb',
    'category': [
      'Protected Areas'
    ],
    'config': {
      'source': {
        'type': 'vector',
        provider: {
          type: 'carto',
          "options": {
            "account": "wri-rw",
            "layers": [
              {
                'type': 'cartodb',
                'options': {
                  'sql': 'SELECT * FROM wat_050_aqueduct_baseline_water_stress',
                  'cartocss': '#layer {polygon-opacity:1; line-width:0.1;line-opacity:1;} [bws_cat=4]{polygon-fill:#990000; line-color:#990000}[bws_cat=3]{polygon-fill:#FF1900; line-color:#FF1900} [bws_cat=2]{polygon-fill:#FF9900; line-color:#FF9900} [bws_cat=1]{polygon-fill:#FFE600; line-color:#FFE600} [bws_cat=0]{polygon-fill:#FFFF99; line-color:#FFFF99}[bws_cat=-1]{polygon-fill:#808080; line-color:#808080}[bws_cat=-9999]{polygon-fill:#4E4E4E; line-color:#4E4E4E}',
                  'cartocss_version': '2.3.0'
                }
              }
            ]
          }
        },
      },
      render: {
        'layers': [
          {
            'paint': {
              'fill-opacity': 1
            },
            'source-layer': 'layer0',
            'type': 'fill',
            'filter': [
              'all'
            ]
          },
          {
            'paint': {
              'line-color': '#990000'
            },
            'source-layer': 'layer0',
            'type': 'line',
            'filter': [
              'all',
              [
                '==',
                'bws_cat',
                4
              ]
            ]
          },
          {
            'paint': {
              'fill-color': '#990000'
            },
            'source-layer': 'layer0',
            'type': 'fill',
            'filter': [
              'all',
              [
                '==',
                'bws_cat',
                4
              ]
            ]
          },
          {
            'paint': {
              'line-color': '#FF1900'
            },
            'source-layer': 'layer0',
            'type': 'line',
            'filter': [
              'all',
              [
                '==',
                'bws_cat',
                3
              ]
            ]
          },
          {
            'paint': {
              'fill-color': '#FF1900'
            },
            'source-layer': 'layer0',
            'type': 'fill',
            'filter': [
              'all',
              [
                '==',
                'bws_cat',
                3
              ]
            ]
          },
          {
            'paint': {
              'line-color': '#FF9900'
            },
            'source-layer': 'layer0',
            'type': 'line',
            'filter': [
              'all',
              [
                '==',
                'bws_cat',
                2
              ]
            ]
          },
          {
            'paint': {
              'fill-color': '#FF9900'
            },
            'source-layer': 'layer0',
            'type': 'fill',
            'filter': [
              'all',
              [
                '==',
                'bws_cat',
                2
              ]
            ]
          },
          {
            'paint': {
              'line-color': '#FFE600'
            },
            'source-layer': 'layer0',
            'type': 'line',
            'filter': [
              'all',
              [
                '==',
                'bws_cat',
                1
              ]
            ]
          },
          {
            'paint': {
              'fill-color': '#FFE600'
            },
            'source-layer': 'layer0',
            'type': 'fill',
            'filter': [
              'all',
              [
                '==',
                'bws_cat',
                1
              ]
            ]
          },
          {
            'paint': {
              'line-color': '#FFFF99'
            },
            'source-layer': 'layer0',
            'type': 'line',
            'filter': [
              'all',
              [
                '==',
                'bws_cat',
                0
              ]
            ]
          },
          {
            'paint': {
              'fill-color': '#FFFF99'
            },
            'source-layer': 'layer0',
            'type': 'fill',
            'filter': [
              'all',
              [
                '==',
                'bws_cat',
                0
              ]
            ]
          },
          {
            'paint': {
              'line-color': '#808080'
            },
            'source-layer': 'layer0',
            'type': 'line',
            'filter': [
              'all',
              [
                '==',
                'bws_cat',
                -1
              ]
            ]
          },
          {
            'paint': {
              'fill-color': '#808080'
            },
            'source-layer': 'layer0',
            'type': 'fill',
            'filter': [
              'all',
              [
                '==',
                'bws_cat',
                -1
              ]
            ]
          },
          {
            'paint': {
              'line-color': '#4E4E4E'
            },
            'source-layer': 'layer0',
            'type': 'line',
            'filter': [
              'all',
              [
                '==',
                'bws_cat',
                -9999
              ]
            ]
          },
          {
            'paint': {
              'fill-color': '#4E4E4E'
            },
            'source-layer': 'layer0',
            'type': 'fill',
            'filter': [
              'all',
              [
                '==',
                'bws_cat',
                -9999
              ]
            ]
          },
          {
            'paint': {
              'line-color': '#525252',
              'line-width': 0.1,
              'line-opacity': 0.3
            },
            'source-layer': 'layer0',
            'type': 'line',
            'filter': [
              'all'
            ]
          }
        ]
      }
      ,
      'legendConfig': {
        'items': [
          {
            'id': 0,
            'color': '#FFFF99',
            'name': 'Low'
          },
          {
            'id': 1,
            'color': '#FFE600',
            'name': 'Low to medium'
          },
          {
            'id': 1,
            'color': '#FF9900',
            'name': 'Medium to high'
          },
          {
            'id': 2,
            'color': '#FF1900',
            'name': 'High'
          },
          {
            'id': 3,
            'color': '#990000',
            'name': 'Extremely high'
          },
          {
            'id': 4,
            'color': '#808080',
            'name': 'Arid and low water use'
          },
          {
            'id': 5,
            'color': '#4E4E4E',
            'name': 'No⠀data'
          }
        ],
        'type': 'choropleth'
      },
      'interactionConfig': {
        'output': [
          {
            'type': 'string',
            'suffix': '',
            'property': 'Baseline water stress',
            'prefix': '',
            'format': null,
            'column': 'bws_label'
          },
          {
            'column': 'cartodb_id',
            'format': null,
            'prefix': '',
            'property': 'Area ID',
            'suffix': '',
            'type': 'number'
          }
        ]
      },
      'applicationConfig': {}
    },
    'organization': 'UNBL',
    'published': true,
    'createdAt': '2020-06-26T10:13:15.006Z',
    'updatedAt': '2020-06-30T17:54:05.880Z',
    'version': 1,
    'references': []

  },
  {

    'id': 'c39013f5-27c3-4a93-8355-1b9a25271a0b',
    'slug': 'accessibility-to-cities-2015',
    'name': 'Accessibility to Cities 2015',
    'type': 'raster',
    'provider': 'gee',
    'category': [
      'Human Impact'
    ],
    'config': {
      'source': {
        'assetId': 'Oxford/MAP/accessibility_to_cities_2015_v1_0',

        'maxNativeZoom': 13,
        'maxzoom': 19,
        'minNativeZoom': 4,
        'minzoom': 2,
        'sldValue': '<RasterSymbolizer><ColorMap type="ramp" extended="false" ><ColorMapEntry color="#ebebe8" quantity="-9999" opacity="0" label="NoData"/><ColorMapEntry color="#8c510a" quantity="0" label="0"/><ColorMapEntry color="#d8b365" quantity="2" label="" /><ColorMapEntry color="#e6f598" quantity="4" label="" /><ColorMapEntry color="#91cf60" quantity="6" label="" /><ColorMapEntry color="#31a354" quantity="12" label="" /><ColorMapEntry color="#006837" quantity="15" label="1" /></ColorMap></RasterSymbolizer>',
        'styleType': 'sld',
        'tiles': ['https://api.resourcewatch.org/v1/layer/d787d894-f7af-47c4-af0f-0849b06686ee/tile/gee/{z}/{x}/{y}'],

        'params_config': [],
        'type': 'raster'
      },
      'legendConfig': {
        'items': [
          {
            'color': '#FFFFFF',
            'name': '0 hours'
          },
          {
            'color': '#C0F09C',
            'name': '1 hour'
          },
          {
            'color': '#E3DA64',
            'name': '2 hours'
          },
          {
            'color': '#D16638',
            'name': '3 hours'
          },
          {
            'color': '#BA2D2F',
            'name': '6 hours'
          },
          {
            'color': '#A11F4A',
            'name': '12 hours'
          },
          {
            'color': '#730D6F',
            'name': '1 day'
          },
          {
            'color': '#0D0437',
            'name': '14 days'
          },
          {
            'color': '#00030F',
            'name': '1 month'
          }
        ],
        'type': 'basic'
      },
      'interactionConfig': {},
      'applicationConfig': {
        'active': true,
        'default': true,
        'global': true,
        'metadata': 'modis-evi-2015'
      },
      'staticImageConfig': {}
    },
    'organization': 'UNBL',
    'published': true,
    'createdAt': '2020-06-25T14:23:12.162Z',
    'updatedAt': '2020-06-26T22:01:05.558Z',
    'version': 3,
    'references': []

  },
  {

    'id': 'a217ee5c-4536-4237-a031-ecadcee71f4a',
    'slug': 'aboveground-live-woody-biomass-density',
    'name': 'Aboveground Live Woody Biomass Density 2000',
    'type': 'raster',
    'provider': 'gee',
    'category': [
      'Climate & Carbon'
    ],
    'config': {
      'source': {
        'assetId': '',

        'maxNativeZoom': 13,
        'maxzoom': 19,
        'minNativeZoom': 4,
        'minzoom': 2,
        'sldValue': '',
        'styleType': 'sld',
        'tiles': ['https://api.resourcewatch.org/v1/layer/8605072c-cfc7-4bc7-b145-90ad7e95976c/tile/gee/{z}/{x}/{y}'],

        'params_config': [],
        'type': 'raster'
      },
      'legendConfig': {
        'items': [
          {
            'color': '#440154',
            'name': '50'
          },
          {
            'color': '#404387',
            'name': '100'
          },
          {
            'color': '#29788E',
            'name': '150'
          },
          {
            'color': '#22A784',
            'name': '200'
          },
          {
            'color': '#79D151',
            'name': '300'
          },
          {
            'color': '#FDE724',
            'name': '400 Mg C/Ha'
          }
        ],
        'type': 'gradient'
      },
      'interactionConfig': {},
      'applicationConfig': {
        'active': true,
        'default': true,
        'global': true,
        'metadata': 'modis-evi-2015'
      },
      'staticImageConfig': {}
    },
    'organization': 'UNBL',
    'published': true,
    'createdAt': '2020-06-25T17:06:47.785Z',
    'updatedAt': '2020-06-30T17:58:21.805Z',
    'version': 4,
    'references': []

  },
  {

    'id': '8947fd12-a010-4d4a-a964-c1eea82ced47',
    'slug': 'elsa-kazakhstan',
    'name': 'ELSA Mapping - Kazakhstan',
    'type': 'raster',
    'provider': 'gee',
    'category': [
      'Human Impact'
    ],
    'config': {
      'source': {
        'assetId': 'projects/earthpulse-sandbox/assets/layers/KAZ_121010_wgs',
        'maxNativeZoom': 13,
        'maxzoom': 19,
        'minNativeZoom': 4,
        'minzoom': 2,
        'sldValue': '<RasterSymbolizer> <ColorMap type="intervals" extended="false"> <ColorMapEntry color="#08E334" label="Protect" quantity="1" opacity="1" /> + <ColorMapEntry color="#E3D208" label="Manage" quantity="2" opacity="1" /> + <ColorMapEntry color="#08DDE3" label="Restore" quantity="3" opacity="1" /> + <ColorMapEntry color="#B615BA" label="Urban" quantity="4" opacity="1" /> + </ColorMap> </RasterSymbolizer>',
        'styleType': 'sld',
        'tiles': ['https://d123t7ufog14bq.cloudfront.net/services/api/v1/tiles/8947fd12-a010-4d4a-a964-c1eea82ced47/{z}/{x}/{y}'],
        'params_config': [],
        'type': 'raster'
      },
      'legendConfig': {
        'items': [
          {
            'color': '#08E334',
            'name': 'Protect'
          },
          {
            'color': '#E3D208',
            'name': 'Manage'
          },
          {
            'color': '#08DDE3',
            'name': 'Restore'
          }
        ],
        'type': 'basic'
      },
      'interactionConfig': {},
      'applicationConfig': {
        'defaultLayer': true,
        'contextLayer': true,
        'widget': [
          {
            'id': 3,
            'slug': 'human'
          }
        ]
      },
      'staticImageConfig': {}
    },
    'organization': 'UNBL-ELSA',
    'published': true,
    'createdAt': '2020-06-30T16:48:08.225Z',
    'updatedAt': '2020-06-30T16:48:30.610Z',
    'version': 1,
    'references': []

  },
  {

    'id': '1c073b0b-4af6-4224-ac4e-27ade34f2678',
    'slug': 'elsa-uganda',
    'name': 'ELSA Mapping - Uganda',
    'type': 'raster',
    'provider': 'gee',
    'category': [
      'Human Impact'
    ],
    'config': {
      'source': {
        'assetId': 'projects/earthpulse-sandbox/assets/layers/uga_p17_m15_r15_all',
        'maxNativeZoom': 13,
        'maxzoom': 19,
        'minNativeZoom': 4,
        'minzoom': 2,
        'sldValue': '<RasterSymbolizer> <ColorMap type="intervals" extended="false"> <ColorMapEntry color="#08E334" label="Protect" quantity="1" opacity="1" /> + <ColorMapEntry color="#E3D208" label="Manage" quantity="2" opacity="1" /> + <ColorMapEntry color="#08DDE3" label="Restore" quantity="3" opacity="1" /> + <ColorMapEntry color="#B615BA" label="Urban" quantity="4" opacity="1" /> + </ColorMap> </RasterSymbolizer>',
        'styleType': 'sld',
        'tiles': ['https://d123t7ufog14bq.cloudfront.net/services/api/v1/tiles/1c073b0b-4af6-4224-ac4e-27ade34f2678/{z}/{x}/{y}'],
        'params_config': [],
        'type': 'raster'
      },
      'legendConfig': {
        'items': [
          {
            'color': '#08E334',
            'name': 'Protect'
          },
          {
            'color': '#E3D208',
            'name': 'Manage'
          },
          {
            'color': '#08DDE3',
            'name': 'Restore'
          }
        ],
        'type': 'basic'
      },
      'interactionConfig': {},
      'applicationConfig': {
        'defaultLayer': true,
        'contextLayer': true,
        'widget': [
          {
            'id': 3,
            'slug': 'human'
          }
        ]
      },
      'staticImageConfig': {}
    },
    'organization': 'UNBL-ELSA',
    'published': true,
    'createdAt': '2020-06-26T22:53:45.711Z',
    'updatedAt': '2020-06-26T22:59:31.891Z',
    'version': 3,
    'references': []

  },
  {

    'id': '60870eaa-706e-4b53-9e8d-ed063325b38b',
    'slug': 'elsa-costa-rica',
    'name': 'ELSA Mapping - Costa Rica',
    'type': 'raster',
    'provider': 'gee',
    'category': [
      'Human Impact'
    ],
    'config': {
      'source': {
        'assetId': 'projects/earthpulse-sandbox/assets/layers/cri_p27_m8_r5_u03_all',
        'maxNativeZoom': 13,
        'maxzoom': 19,
        'minNativeZoom': 4,
        'minzoom': 2,
        'sldValue': '<RasterSymbolizer> <ColorMap type="intervals" extended="false"> <ColorMapEntry color="#08E334" label="Protect" quantity="1" opacity="1" /> + <ColorMapEntry color="#E3D208" label="Manage" quantity="2" opacity="1" /> + <ColorMapEntry color="#08DDE3" label="Restore" quantity="3" opacity="1" /> + <ColorMapEntry color="#B615BA" label="Urban" quantity="4" opacity="1" /> + </ColorMap> </RasterSymbolizer>',
        'styleType': 'sld',
        'tiles': ['https://d123t7ufog14bq.cloudfront.net/services/api/v1/tiles/60870eaa-706e-4b53-9e8d-ed063325b38b/{z}/{x}/{y}'],
        'params_config': [],
        'type': 'raster'
      },
      'legendConfig': {
        'items': [
          {
            'color': '#08E334',
            'name': 'Protect'
          },
          {
            'color': '#E3D208',
            'name': 'Manage'
          },
          {
            'color': '#08DDE3',
            'name': 'Restore'
          },
          {
            'color': '#B615BA',
            'name': 'Urban'
          }
        ],
        'type': 'basic'
      },
      'interactionConfig': {},
      'applicationConfig': {
        'defaultLayer': true,
        'contextLayer': true,
        'widget': [
          {
            'id': 3,
            'slug': 'human'
          }
        ]
      },
      'staticImageConfig': {}
    },
    'organization': 'UNBL-ELSA',
    'published': true,
    'createdAt': '2020-06-26T22:51:20.396Z',
    'updatedAt': '2020-06-26T22:52:01.096Z',
    'version': 1,
    'references': []

  },
  {

    'id': 'e04026e7-e9be-4a65-9913-1b36604ed8d7',
    'slug': 'protected-area-connectivity',
    'name': 'Protected Area Connectivity',
    'description': '',
    'type': 'vector',
    'provider': 'cartodb',
    'category': [
      'Protected Areas'
    ],
    'config': {
      'source': {
        'format': 'image/png',
        'options': {
          'useCors': true
        },
        'minzoom': 2,
        'maxzoom': 19

      },
      'legendConfig': {
        'legendType': 'yearpicker',
        'items': [
          {
            'color': '#8c510a',
            'value': '0'
          },
          {
            'color': '#d8b365',
            'value': ''
          },
          {
            'color': '#e6f598',
            'value': ''
          },
          {
            'color': '#91cf60',
            'value': ''
          },
          {
            'color': '#31a354',
            'value': ''
          },
          {
            'color': '#006837',
            'value': '1'
          }
        ],
        'type': 'gradient'
      },
      'interactionConfig': {},
      'applicationConfig': {
        'active': true,
        'default': true,
        'global': true
      },
      'staticImageConfig': {}
    },
    'organization': 'UNBL',
    'published': true,
    'createdAt': '2020-06-26T08:38:21.557Z',
    'updatedAt': '2020-06-26T13:00:47.276Z',
    'version': 1,
    'references': [
      {
        'category': [
          'Protected Areas'
        ],
        'published': true,
        'version': 0,
        'references': [],
        'name': 'Protected Connected Land by Country (%)',
        'slug': 'protected-connected-land-by-country',
        'type': 'vector',
        'provider': 'cartodb',
        'config': {
          'source': {
            'account': 'wri-rw',
            'maxzoom': 18,
            'layerType': 'vector'
          },
          render: {
            'layers': [
              {
                'type': 'fill',
                'source-layer': 'layer0',
                'options': {
                  'sql': 'SELECT wri.cartodb_id, ST_Transform(wri.the_geom, 3857) AS the_geom_webmercator, wri.name, data.iso3, data.protconn_b FROM bio_040_prot_conn_countries data LEFT OUTER JOIN wri_countries_a wri ON data.iso3 = wri.iso_a3 AND wri.name IS NOT NULL',
                  'cartocss': '#bio_040_prot_conn_countries {polygon-opacity: 1; line-width: 0; line-color: #FFF; line-opacity: 1;} [protconn_b>=50]{polygon-fill:#597D58;} [protconn_b>=30][protconn_b<50]{polygon-fill:#729D64;} [protconn_b>=17][protconn_b<30]{polygon-fill:#9CBE6F;} [protconn_b>=12][protconn_b<17]{polygon-fill:#C4DB70;}  [protconn_b>=8][protconn_b<12]{polygon-fill:#FAEE70;}  [protconn_b>=5][protconn_b<8]{polygon-fill:#F8D86A;}  [protconn_b>=2][protconn_b<5]{polygon-fill:#F9B361;} [protconn_b>=1][protconn_b<2]{polygon-fill:#F19158;} [protconn_b<1]{polygon-fill:#F17651;}',
                  'cartocss_version': '2.3.0'
                }
              }
            ],
            'vectorLayers': [
              {
                'paint': {
                  'fill-opacity': 1
                },
                'source-layer': 'layer0',
                'type': 'fill',
                'filter': [
                  'all'
                ]
              },
              {
                'paint': {
                  'fill-color': '#597D58'
                },
                'source-layer': 'layer0',
                'type': 'fill',
                'filter': [
                  'all',
                  [
                    '>=',
                    'protconn_b',
                    50
                  ]
                ]
              },
              {
                'paint': {
                  'fill-color': '#729D64'
                },
                'source-layer': 'layer0',
                'type': 'fill',
                'filter': [
                  'all',
                  [
                    '>=',
                    'protconn_b',
                    30
                  ],
                  [
                    '<',
                    'protconn_b',
                    50
                  ]
                ]
              },
              {
                'paint': {
                  'fill-color': '#9CBE6F'
                },
                'source-layer': 'layer0',
                'type': 'fill',
                'filter': [
                  'all',
                  [
                    '>=',
                    'protconn_b',
                    17
                  ],
                  [
                    '<',
                    'protconn_b',
                    30
                  ]
                ]
              },
              {
                'paint': {
                  'fill-color': '#C4DB70'
                },
                'source-layer': 'layer0',
                'type': 'fill',
                'filter': [
                  'all',
                  [
                    '>=',
                    'protconn_b',
                    12
                  ],
                  [
                    '<',
                    'protconn_b',
                    17
                  ]
                ]
              },
              {
                'paint': {
                  'fill-color': '#FAEE70'
                },
                'source-layer': 'layer0',
                'type': 'fill',
                'filter': [
                  'all',
                  [
                    '>=',
                    'protconn_b',
                    8
                  ],
                  [
                    '<',
                    'protconn_b',
                    12
                  ]
                ]
              },
              {
                'paint': {
                  'fill-color': '#F8D86A'
                },
                'source-layer': 'layer0',
                'type': 'fill',
                'filter': [
                  'all',
                  [
                    '>=',
                    'protconn_b',
                    5
                  ],
                  [
                    '<',
                    'protconn_b',
                    8
                  ]
                ]
              },
              {
                'paint': {
                  'fill-color': '#F9B361'
                },
                'source-layer': 'layer0',
                'type': 'fill',
                'filter': [
                  'all',
                  [
                    '>=',
                    'protconn_b',
                    2
                  ],
                  [
                    '<',
                    'protconn_b',
                    5
                  ]
                ]
              },
              {
                'paint': {
                  'fill-color': '#F19158'
                },
                'source-layer': 'layer0',
                'type': 'fill',
                'filter': [
                  'all',
                  [
                    '>=',
                    'protconn_b',
                    1
                  ],
                  [
                    '<',
                    'protconn_b',
                    2
                  ]
                ]
              },
              {
                'paint': {
                  'fill-color': '#F17651'
                },
                'source-layer': 'layer0',
                'type': 'fill',
                'filter': [
                  'all',
                  [
                    '<',
                    'protconn_b',
                    1
                  ]
                ]
              },
              {
                'paint': {
                  'line-width': 0.5,
                  'line-color': '#525252',
                  'line-opacity': 0.3
                },
                'source-layer': 'layer0',
                'type': 'line',
                'filter': [
                  'all'
                ]
              }
            ],
          },
          'legendConfig': {
            'items': [
              {
                'color': '#F17651',
                'name': '<1',
                'id': 0
              },
              {
                'color': '#F19158',
                'name': '<2',
                'id': 1
              },
              {
                'color': '#F9B361',
                'name': '<5',
                'id': 2
              },
              {
                'color': '#F8D86A',
                'name': '<8',
                'id': 3
              },
              {
                'color': '#FAEE70',
                'name': '<12',
                'id': 4
              },
              {
                'color': '#C4DB70',
                'name': '<17',
                'id': 5
              },
              {
                'color': '#9CBE6F',
                'name': '<30',
                'id': 6
              },
              {
                'color': '#729D64',
                'name': '<50',
                'id': 7
              },
              {
                'color': '#597D58',
                'name': '≥50',
                'id': 8
              }
            ],
            'type': 'choropleth'
          },
          'interactionConfig': {
            'output': [
              {
                'column': 'name',
                'format': null,
                'prefix': '',
                'property': 'Country',
                'suffix': ''
              },
              {
                'column': 'protconn_b',
                'format': null,
                'prefix': '',
                'property': 'Percent of country area covered by protected connected lands',
                'suffix': ''
              }
            ]
          },
          'applicationConfig': {}
        },
        'organization': 'UNBL',
        'createdAt': '2020-06-26T08:34:16.929Z',
        'updatedAt': '2020-06-26T08:34:16.929Z',
        'id': '76d4d440-7ea1-4b68-94c0-c76f8a147fbd'
      },
      {
        'category': [
          'Protected Areas'
        ],
        'published': true,
        'version': 3,
        'references': [],
        'description': '',
        'name': 'Protected Land That Is Connected by Ecoregion (%25)',
        'slug': 'protected-land-that-is-connected-by-ecoregion',
        'type': 'vector',
        'provider': 'cartodb',
        'config': {
          'source': {
            'maxzoom': 18,
            'account': 'wri-rw',
            'layerType': 'vector',
          },
          render: {
            'layers': [
              {
                'options': {
                  'cartocss_version': '2.3.0',
                  'cartocss': '#bio_040_prot_conn_ecoregions {polygon-opacity: 1; line-width: 0; line-color: #FFF; line-opacity: 1;} [protconn>=50]{polygon-fill:#597D58;} [protconn>=30][protconn<50]{polygon-fill:#729D64;} [protconn>=17][protconn<30]{polygon-fill:#9CBE6F;} [protconn>=12][protconn<17]{polygon-fill:#C4DB70;}  [protconn>=8][protconn<12]{polygon-fill:#FAEE70;}  [protconn>=5][protconn<8]{polygon-fill:#F8D86A;}  [protconn>=2][protconn<5]{polygon-fill:#F9B361;} [protconn>=1][protconn<2]{polygon-fill:#F19158;} [protconn<1]{polygon-fill:#F17651;}',
                  'sql': 'SELECT * FROM bio_040_prot_conn_ecoregions'
                },
                'source-layer': 'layer0',
                'type': 'fill'
              }
            ],
            'vectorLayers': [
              {
                'paint': {
                  'fill-opacity': 1
                },
                'source-layer': 'layer0',
                'type': 'fill',
                'filter': [
                  'all'
                ]
              },
              {
                'paint': {
                  'fill-color': '#597D58'
                },
                'source-layer': 'layer0',
                'type': 'fill',
                'filter': [
                  'all',
                  [
                    '>=',
                    'protconn',
                    50
                  ]
                ]
              },
              {
                'paint': {
                  'fill-color': '#729D64'
                },
                'source-layer': 'layer0',
                'type': 'fill',
                'filter': [
                  'all',
                  [
                    '>=',
                    'protconn',
                    30
                  ],
                  [
                    '<',
                    'protconn',
                    50
                  ]
                ]
              },
              {
                'paint': {
                  'fill-color': '#9CBE6F'
                },
                'source-layer': 'layer0',
                'type': 'fill',
                'filter': [
                  'all',
                  [
                    '>=',
                    'protconn',
                    17
                  ],
                  [
                    '<',
                    'protconn',
                    30
                  ]
                ]
              },
              {
                'paint': {
                  'fill-color': '#C4DB70'
                },
                'source-layer': 'layer0',
                'type': 'fill',
                'filter': [
                  'all',
                  [
                    '>=',
                    'protconn',
                    12
                  ],
                  [
                    '<',
                    'protconn',
                    17
                  ]
                ]
              },
              {
                'paint': {
                  'fill-color': '#FAEE70'
                },
                'source-layer': 'layer0',
                'type': 'fill',
                'filter': [
                  'all',
                  [
                    '>=',
                    'protconn',
                    8
                  ],
                  [
                    '<',
                    'protconn',
                    12
                  ]
                ]
              },
              {
                'paint': {
                  'fill-color': '#F8D86A'
                },
                'source-layer': 'layer0',
                'type': 'fill',
                'filter': [
                  'all',
                  [
                    '>=',
                    'protconn',
                    5
                  ],
                  [
                    '<',
                    'protconn',
                    8
                  ]
                ]
              },
              {
                'paint': {
                  'fill-color': '#F9B361'
                },
                'source-layer': 'layer0',
                'type': 'fill',
                'filter': [
                  'all',
                  [
                    '>=',
                    'protconn',
                    2
                  ],
                  [
                    '<',
                    'protconn',
                    5
                  ]
                ]
              },
              {
                'paint': {
                  'fill-color': '#F19158'
                },
                'source-layer': 'layer0',
                'type': 'fill',
                'filter': [
                  'all',
                  [
                    '>=',
                    'protconn',
                    1
                  ],
                  [
                    '<',
                    'protconn',
                    2
                  ]
                ]
              },
              {
                'paint': {
                  'fill-color': '#F17651'
                },
                'source-layer': 'layer0',
                'type': 'fill',
                'filter': [
                  'all',
                  [
                    '<',
                    'protconn',
                    1
                  ]
                ]
              },
              {
                'paint': {
                  'line-width': 0.5,
                  'line-color': '#525252',
                  'line-opacity': 0.3
                },
                'source-layer': 'layer0',
                'type': 'line',
                'filter': [
                  'all'
                ]
              }
            ],
          },
          'legendConfig': {
            'type': 'choropleth',
            'items': [
              {
                'name': '<1',
                'color': '#F17651',
                'id': 0
              },
              {
                'name': '<2',
                'color': '#F19158',
                'id': 1
              },
              {
                'name': '<5',
                'color': '#F9B361',
                'id': 2
              },
              {
                'name': '<8',
                'color': '#F8D86A',
                'id': 3
              },
              {
                'name': '<12',
                'color': '#FAEE70',
                'id': 4
              },
              {
                'name': '<17',
                'color': '#C4DB70',
                'id': 5
              },
              {
                'name': '<30',
                'color': '#9CBE6F',
                'id': 6
              },
              {
                'name': '<50',
                'color': '#729D64',
                'id': 7
              },
              {
                'name': '≥50',
                'color': '#597D58',
                'id': 8
              }
            ]
          },
          'interactionConfig': {
            'output': [
              {
                'column': 'eco_name',
                'format': null,
                'prefix': '',
                'property': 'Ecoregion',
                'suffix': '',
                'type': 'string'
              },
              {
                'column': 'biome',
                'format': null,
                'prefix': '',
                'property': 'Biome',
                'suffix': '',
                'type': 'string'
              },
              {
                'column': 'protconn',
                'format': null,
                'prefix': '',
                'property': 'ProtConn',
                'suffix': ' %',
                'type': 'number'
              },
              {
                'column': 'cartodb_id',
                'format': null,
                'prefix': '',
                'property': 'Area ID',
                'suffix': '',
                'type': 'number'
              }
            ]
          },
          'applicationConfig': {}
        },
        'organization': 'UNBL',
        'createdAt': '2020-06-26T08:35:44.135Z',
        'updatedAt': '2020-06-30T08:31:58.935Z',
        'id': '53df0f51-2758-4c73-b48f-f3316102e59d'
      }
    ]
  },
  {

    'id': 'a64f41f0-8798-4ed8-8376-2efa4ab70f63',
    'slug': 'population-density-2015',
    'name': 'Population Density 2015 (CIESIN, 2017)',
    'type': 'raster',
    'provider': 'gee',
    'category': [
      'Human Impact'
    ],
    'config': {
      'source': {
        'type': 'raster',
        'paramsConfig': [],
        'isImageCollection': false,

        'styleType': 'sld',
        'sldValue': '<RasterSymbolizer> + <ColorMap type="gradient" extended="false" > + <ColorMapEntry color="#912512" quantity="1" opacity="0"/> + <ColorMapEntry color="#ed602a" quantity="10" /> + <ColorMapEntry color="#ee702d" quantity="50"  /> + <ColorMapEntry color="#ef8528" quantity="75" /> + <ColorMapEntry color="#f19336" quantity="100" /> + <ColorMapEntry color="#f2a567" quantity="150" /> + <ColorMapEntry color="#f7ce9d" quantity="175" /> + <ColorMapEntry color="#fbe9d2" quantity="200" /> + </ColorMap> + </RasterSymbolizer>',
        'minzoom': 2,
        'minNativeZoom': 3,
        'maxzoom': 19,
        'maxNativeZoom': 13,

        'assetId': 'CIESIN/GPWv4/population-density/2015',
        'tiles': ['https://d123t7ufog14bq.cloudfront.net/services/api/v1/tiles/a64f41f0-8798-4ed8-8376-2efa4ab70f63/{z}/{x}/{y}']
      },
      'legendConfig': {
        'type': 'gradient',
        'items': [
          {
            'value': '1',
            'color': '#912512'
          },
          {
            'value': '',
            'color': '#ed602a'
          },
          {
            'value': '',
            'color': '#ee702d'
          },
          {
            'value': '',
            'color': '#ef8528'
          },
          {
            'value': '',
            'color': '#f19336'
          },
          {
            'value': '',
            'color': '#f2a567'
          },
          {
            'value': '',
            'color': '#f7ce9d'
          },
          {
            'value': '>200 persons/1km²',
            'color': '#fbe9d2'
          }
        ]
      },
      'interactionConfig': {},
      'applicationConfig': {
        'metadata': 'global_population_jrc',
        'global': true,
        'default': true,
        'analysisConfig': [
          {
            'version': 'v1',
            'type': 'geostore',
            'service': 'population',
            'keys': [
              {
                'unit': 'people',
                'title': 'Total population',
                'key': 'totalPopulation'
              },
              {
                'unit': 'people Ha⁻¹',
                'title': 'Population density',
                'key': 'populationDensity'
              }
            ]
          },
          {
            'version': 'v1',
            'type': 'admin',
            'service': 'population',
            'keys': [
              {
                'unit': 'people',
                'title': 'Total population',
                'key': 'totalPopulation'
              },
              {
                'unit': 'people Ha⁻¹',
                'title': 'Population density',
                'key': 'populationDensity'
              }
            ]
          }
        ],
        'active': true
      },
      'staticImageConfig': {}
    },
    'organization': 'UNBL',
    'published': true,
    'createdAt': '2020-06-26T22:28:15.312Z',
    'updatedAt': '2020-06-26T22:29:57.189Z',
    'version': 1,
    'references': []

  },
  {

    'id': 'a23e8629-0c17-499e-9ae8-be618d9d79f7',
    'slug': 'modis-evi',
    'name': 'MODIS EVI',
    'type': 'raster',
    'provider': 'gee',
    'category': [
      'Land Cover'
    ],
    'config': {
      'source': {
        'type': 'raster',
        'minzoom': 2,
        'maxzoom': 19
      },
      'legendConfig': {
        'legendType': 'yearpicker',
        'items': [
          {
            'color': '#8c510a',
            'value': '0'
          },
          {
            'color': '#d8b365',
            'value': ''
          },
          {
            'color': '#e6f598',
            'value': ''
          },
          {
            'color': '#91cf60',
            'value': ''
          },
          {
            'color': '#31a354',
            'value': ''
          },
          {
            'color': '#006837',
            'value': '1'
          }
        ],
        'type': 'gradient'
      },
      'interactionConfig': {},
      'applicationConfig': {
        'active': true,
        'default': true,
        'global': true,
        'metadata': 'Modis-evi'
      },
      'staticImageConfig': {}
    },
    'organization': 'UNBL',
    'published': true,
    'createdAt': '2020-06-26T14:50:22.698Z',
    'updatedAt': '2020-06-30T20:16:24.450Z',
    'version': 8,
    'references': [
      {
        'category': [
          'Land Cover'
        ],
        'published': true,
        'version': 2,
        'references': [],
        'slug': 'modis-evi-2019',
        'name': 'MODIS EVI 2019',
        'description': '',
        'type': 'raster',
        'provider': 'gee',
        'config': {
          'source': {
            'assetId': 'projects/earthpulse-sandbox/assets/layers/modis_evi_2019',
            'maxNativeZoom': 13,
            'maxzoom': 19,
            'minNativeZoom': 4,
            'minzoom': 2,
            'sldValue': '<RasterSymbolizer><ColorMap type="ramp" extended="false" ><ColorMapEntry color="#ebebe8" quantity="-9999" opacity="0" label="NoData"/><ColorMapEntry color="#8c510a" quantity="0" label="0"/><ColorMapEntry color="#d8b365" quantity="2" label="" /><ColorMapEntry color="#e6f598" quantity="4" label="" /><ColorMapEntry color="#91cf60" quantity="6" label="" /><ColorMapEntry color="#31a354" quantity="12" label="" /><ColorMapEntry color="#006837" quantity="15" label="1" /></ColorMap></RasterSymbolizer>',
            'styleType': 'sld',
            'tiles': ['https://d123t7ufog14bq.cloudfront.net/services/api/v1/tiles/49cebd34-9d81-493c-9685-0191564129ab/{z}/{x}/{y}'],
            'params_config': [],
            'type': 'raster'
          },
          'legendConfig': {
            'items': [
              {
                'color': '#8c510a',
                'value': '0'
              },
              {
                'color': '#d8b365',
                'value': ''
              },
              {
                'color': '#e6f598',
                'value': ''
              },
              {
                'color': '#91cf60',
                'value': ''
              },
              {
                'color': '#31a354',
                'value': ''
              },
              {
                'color': '#006837',
                'value': '1'
              }
            ],
            'type': 'gradient'
          },
          'interactionConfig': {},
          'applicationConfig': {
            'active': true,
            'default': true,
            'global': true
          },
          'staticImageConfig': {}
        },
        'organization': 'UNBL',
        'createdAt': '2020-06-26T14:45:30.611Z',
        'updatedAt': '2020-06-30T21:22:46.176Z',
        'id': '49cebd34-9d81-493c-9685-0191564129ab'
      },
      {
        'category': [
          'Land Cover'
        ],
        'published': true,
        'version': 2,
        'references': [],
        'slug': 'modis-evi-2018',
        'name': 'MODIS EVI 2018',
        'description': '',
        'type': 'raster',
        'provider': 'gee',
        'config': {
          'source': {
            'assetId': 'projects/earthpulse-sandbox/assets/layers/modis_evi_2018',
            'maxNativeZoom': 13,
            'maxzoom': 19,
            'minNativeZoom': 4,
            'minzoom': 2,
            'sldValue': '<RasterSymbolizer><ColorMap type="ramp" extended="false" ><ColorMapEntry color="#ebebe8" quantity="-9999" opacity="0" label="NoData"/><ColorMapEntry color="#8c510a" quantity="0" label="0"/><ColorMapEntry color="#d8b365" quantity="2" label="" /><ColorMapEntry color="#e6f598" quantity="4" label="" /><ColorMapEntry color="#91cf60" quantity="6" label="" /><ColorMapEntry color="#31a354" quantity="12" label="" /><ColorMapEntry color="#006837" quantity="15" label="1" /></ColorMap></RasterSymbolizer>',
            'styleType': 'sld',
            'tiles': ['https://d123t7ufog14bq.cloudfront.net/services/api/v1/tiles/23458750-5cb7-48ed-aaae-e900d5bd7704/{z}/{x}/{y}'],
            'params_config': [],
            'type': 'raster'
          },
          'legendConfig': {
            'items': [
              {
                'color': '#8c510a',
                'value': '0'
              },
              {
                'color': '#d8b365',
                'value': ''
              },
              {
                'color': '#e6f598',
                'value': ''
              },
              {
                'color': '#91cf60',
                'value': ''
              },
              {
                'color': '#31a354',
                'value': ''
              },
              {
                'color': '#006837',
                'value': '1'
              }
            ],
            'type': 'gradient'
          },
          'interactionConfig': {},
          'applicationConfig': {
            'active': true,
            'default': true,
            'global': true
          },
          'staticImageConfig': {}
        },
        'organization': 'UNBL',
        'createdAt': '2020-06-26T14:45:02.304Z',
        'updatedAt': '2020-06-30T21:21:52.501Z',
        'id': '23458750-5cb7-48ed-aaae-e900d5bd7704'
      },
      {
        'category': [
          'Land Cover'
        ],
        'published': true,
        'version': 2,
        'references': [],
        'slug': 'modis-evi-2017',
        'name': 'MODIS EVI 2017',
        'description': '',
        'type': 'raster',
        'provider': 'gee',
        'config': {
          'source': {
            'assetId': 'projects/earthpulse-sandbox/assets/layers/modis_evi_2017',

            'maxNativeZoom': 13,
            'maxzoom': 19,
            'minNativeZoom': 4,
            'minzoom': 2,
            'sldValue': '<RasterSymbolizer><ColorMap type="ramp" extended="false" ><ColorMapEntry color="#ebebe8" quantity="-9999" opacity="0" label="NoData"/><ColorMapEntry color="#8c510a" quantity="0" label="0"/><ColorMapEntry color="#d8b365" quantity="2" label="" /><ColorMapEntry color="#e6f598" quantity="4" label="" /><ColorMapEntry color="#91cf60" quantity="6" label="" /><ColorMapEntry color="#31a354" quantity="12" label="" /><ColorMapEntry color="#006837" quantity="15" label="1" /></ColorMap></RasterSymbolizer>',
            'styleType': 'sld',
            'tiles': ['https://d123t7ufog14bq.cloudfront.net/services/api/v1/tiles/65f2fc45-4ed3-4e80-ae93-b6ee54f920c2/{z}/{x}/{y}'],

            'params_config': [],
            'type': 'raster'
          },
          'legendConfig': {
            'items': [
              {
                'color': '#8c510a',
                'value': '0'
              },
              {
                'color': '#d8b365',
                'value': ''
              },
              {
                'color': '#e6f598',
                'value': ''
              },
              {
                'color': '#91cf60',
                'value': ''
              },
              {
                'color': '#31a354',
                'value': ''
              },
              {
                'color': '#006837',
                'value': '1'
              }
            ],
            'type': 'gradient'
          },
          'interactionConfig': {},
          'applicationConfig': {
            'active': true,
            'default': true,
            'global': true
          },
          'staticImageConfig': {}
        },
        'organization': 'UNBL',
        'createdAt': '2020-06-26T14:44:24.302Z',
        'updatedAt': '2020-06-30T21:21:14.315Z',
        'id': '65f2fc45-4ed3-4e80-ae93-b6ee54f920c2'
      },
      {
        'category': [
          'Land Cover'
        ],
        'published': true,
        'version': 2,
        'references': [],
        'slug': 'modis-evi-2016',
        'name': 'MODIS EVI 2016',
        'description': '',
        'type': 'raster',
        'provider': 'gee',
        'config': {
          'source': {
            'assetId': 'projects/earthpulse-sandbox/assets/layers/modis_evi_2016',

            'maxNativeZoom': 13,
            'maxzoom': 19,
            'minNativeZoom': 4,
            'minzoom': 2,
            'sldValue': '<RasterSymbolizer><ColorMap type="ramp" extended="false" ><ColorMapEntry color="#ebebe8" quantity="-9999" opacity="0" label="NoData"/><ColorMapEntry color="#8c510a" quantity="0" label="0"/><ColorMapEntry color="#d8b365" quantity="2" label="" /><ColorMapEntry color="#e6f598" quantity="4" label="" /><ColorMapEntry color="#91cf60" quantity="6" label="" /><ColorMapEntry color="#31a354" quantity="12" label="" /><ColorMapEntry color="#006837" quantity="15" label="1" /></ColorMap></RasterSymbolizer>',
            'styleType': 'sld',
            'tiles': ['https://d123t7ufog14bq.cloudfront.net/services/api/v1/tiles/22d3ab10-934a-4a53-9a19-3deb0ad22944/{z}/{x}/{y}'],

            'params_config': [],
            'type': 'raster'
          },
          'legendConfig': {
            'items': [
              {
                'color': '#8c510a',
                'value': '0'
              },
              {
                'color': '#d8b365',
                'value': ''
              },
              {
                'color': '#e6f598',
                'value': ''
              },
              {
                'color': '#91cf60',
                'value': ''
              },
              {
                'color': '#31a354',
                'value': ''
              },
              {
                'color': '#006837',
                'value': '1'
              }
            ],
            'type': 'gradient'
          },
          'interactionConfig': {},
          'applicationConfig': {
            'active': true,
            'default': true,
            'global': true
          },
          'staticImageConfig': {}
        },
        'organization': 'UNBL',
        'createdAt': '2020-06-26T14:43:55.020Z',
        'updatedAt': '2020-06-30T21:20:32.834Z',
        'id': '22d3ab10-934a-4a53-9a19-3deb0ad22944'
      },
      {
        'category': [
          'Land Cover'
        ],
        'published': true,
        'version': 2,
        'references': [],
        'slug': 'modis-evi-2015',
        'name': 'MODIS EVI 2015',
        'description': '',
        'type': 'raster',
        'provider': 'gee',
        'config': {
          'source': {
            'assetId': 'projects/earthpulse-sandbox/assets/layers/modis_evi_2015',

            'maxNativeZoom': 13,
            'maxzoom': 19,
            'minNativeZoom': 4,
            'minzoom': 2,
            'sldValue': '<RasterSymbolizer><ColorMap type="ramp" extended="false" ><ColorMapEntry color="#ebebe8" quantity="-9999" opacity="0" label="NoData"/><ColorMapEntry color="#8c510a" quantity="0" label="0"/><ColorMapEntry color="#d8b365" quantity="2" label="" /><ColorMapEntry color="#e6f598" quantity="4" label="" /><ColorMapEntry color="#91cf60" quantity="6" label="" /><ColorMapEntry color="#31a354" quantity="12" label="" /><ColorMapEntry color="#006837" quantity="15" label="1" /></ColorMap></RasterSymbolizer>',
            'styleType': 'sld',
            'tiles': ['https://d123t7ufog14bq.cloudfront.net/services/api/v1/tiles/78a625e8-f57a-4e2a-bd32-249e74ed4b66/{z}/{x}/{y}'],

            'params_config': [],
            'type': 'raster'
          },
          'legendConfig': {
            'items': [
              {
                'color': '#8c510a',
                'value': '0'
              },
              {
                'color': '#d8b365',
                'value': ''
              },
              {
                'color': '#e6f598',
                'value': ''
              },
              {
                'color': '#91cf60',
                'value': ''
              },
              {
                'color': '#31a354',
                'value': ''
              },
              {
                'color': '#006837',
                'value': '1'
              }
            ],
            'type': 'gradient'
          },
          'interactionConfig': {},
          'applicationConfig': {
            'active': true,
            'default': true,
            'global': true
          },
          'staticImageConfig': {}
        },
        'organization': 'UNBL',
        'createdAt': '2020-06-26T14:43:26.176Z',
        'updatedAt': '2020-06-30T21:19:56.366Z',
        'id': '78a625e8-f57a-4e2a-bd32-249e74ed4b66'
      },
      {
        'category': [
          'Land Cover'
        ],
        'published': true,
        'version': 2,
        'references': [],
        'slug': 'modis-evi-2014',
        'name': 'MODIS EVI 2014',
        'description': '',
        'type': 'raster',
        'provider': 'gee',
        'config': {
          'source': {
            'assetId': 'projects/earthpulse-sandbox/assets/layers/modis_evi_2014',

            'maxNativeZoom': 13,
            'maxzoom': 19,
            'minNativeZoom': 4,
            'minzoom': 2,
            'sldValue': '<RasterSymbolizer><ColorMap type="ramp" extended="false" ><ColorMapEntry color="#ebebe8" quantity="-9999" opacity="0" label="NoData"/><ColorMapEntry color="#8c510a" quantity="0" label="0"/><ColorMapEntry color="#d8b365" quantity="2" label="" /><ColorMapEntry color="#e6f598" quantity="4" label="" /><ColorMapEntry color="#91cf60" quantity="6" label="" /><ColorMapEntry color="#31a354" quantity="12" label="" /><ColorMapEntry color="#006837" quantity="15" label="1" /></ColorMap></RasterSymbolizer>',
            'styleType': 'sld',
            'tiles': ['https://d123t7ufog14bq.cloudfront.net/services/api/v1/tiles/d162455a-833b-43e6-b496-2729ea6ae8e1/{z}/{x}/{y}'],

            'params_config': [],
            'type': 'raster'
          },
          'legendConfig': {
            'items': [
              {
                'color': '#8c510a',
                'value': '0'
              },
              {
                'color': '#d8b365',
                'value': ''
              },
              {
                'color': '#e6f598',
                'value': ''
              },
              {
                'color': '#91cf60',
                'value': ''
              },
              {
                'color': '#31a354',
                'value': ''
              },
              {
                'color': '#006837',
                'value': '1'
              }
            ],
            'type': 'gradient'
          },
          'interactionConfig': {},
          'applicationConfig': {
            'active': true,
            'default': true,
            'global': true
          },
          'staticImageConfig': {}
        },
        'organization': 'UNBL',
        'createdAt': '2020-06-26T14:42:47.197Z',
        'updatedAt': '2020-06-30T21:12:03.211Z',
        'id': 'd162455a-833b-43e6-b496-2729ea6ae8e1'
      },
      {
        'category': [
          'Land Cover'
        ],
        'published': true,
        'version': 2,
        'references': [],
        'slug': 'modis-evi-2013',
        'name': 'MODIS EVI 2013',
        'description': '',
        'type': 'raster',
        'provider': 'gee',
        'config': {
          'source': {
            'assetId': 'projects/earthpulse-sandbox/assets/layers/modis_evi_2013',

            'maxNativeZoom': 13,
            'maxzoom': 19,
            'minNativeZoom': 4,
            'minzoom': 2,
            'sldValue': '<RasterSymbolizer><ColorMap type="ramp" extended="false" ><ColorMapEntry color="#ebebe8" quantity="-9999" opacity="0" label="NoData"/><ColorMapEntry color="#8c510a" quantity="0" label="0"/><ColorMapEntry color="#d8b365" quantity="2" label="" /><ColorMapEntry color="#e6f598" quantity="4" label="" /><ColorMapEntry color="#91cf60" quantity="6" label="" /><ColorMapEntry color="#31a354" quantity="12" label="" /><ColorMapEntry color="#006837" quantity="15" label="1" /></ColorMap></RasterSymbolizer>',
            'styleType': 'sld',
            'tiles': ['https://d123t7ufog14bq.cloudfront.net/services/api/v1/tiles/e711fa41-8efa-4262-91c8-f7ca20ca21d7/{z}/{x}/{y}'],

            'params_config': [],
            'type': 'raster'
          },
          'legendConfig': {
            'items': [
              {
                'color': '#8c510a',
                'value': '0'
              },
              {
                'color': '#d8b365',
                'value': ''
              },
              {
                'color': '#e6f598',
                'value': ''
              },
              {
                'color': '#91cf60',
                'value': ''
              },
              {
                'color': '#31a354',
                'value': ''
              },
              {
                'color': '#006837',
                'value': '1'
              }
            ],
            'type': 'gradient'
          },
          'interactionConfig': {},
          'applicationConfig': {
            'active': true,
            'default': true,
            'global': true
          },
          'staticImageConfig': {}
        },
        'organization': 'UNBL',
        'createdAt': '2020-06-26T14:42:18.623Z',
        'updatedAt': '2020-06-30T21:11:05.035Z',
        'id': 'e711fa41-8efa-4262-91c8-f7ca20ca21d7'
      },
      {
        'category': [
          'Land Cover'
        ],
        'published': true,
        'version': 2,
        'references': [],
        'slug': 'modis-evi-2012',
        'name': 'MODIS EVI 2012',
        'description': '',
        'type': 'raster',
        'provider': 'gee',
        'config': {
          'source': {
            'assetId': 'projects/earthpulse-sandbox/assets/layers/modis_evi_2012',

            'maxNativeZoom': 13,
            'maxzoom': 19,
            'minNativeZoom': 4,
            'minzoom': 2,
            'sldValue': '<RasterSymbolizer><ColorMap type="ramp" extended="false" ><ColorMapEntry color="#ebebe8" quantity="-9999" opacity="0" label="NoData"/><ColorMapEntry color="#8c510a" quantity="0" label="0"/><ColorMapEntry color="#d8b365" quantity="2" label="" /><ColorMapEntry color="#e6f598" quantity="4" label="" /><ColorMapEntry color="#91cf60" quantity="6" label="" /><ColorMapEntry color="#31a354" quantity="12" label="" /><ColorMapEntry color="#006837" quantity="15" label="1" /></ColorMap></RasterSymbolizer>',
            'styleType': 'sld',
            'tiles': ['https://d123t7ufog14bq.cloudfront.net/services/api/v1/tiles/67f46274-445c-46d8-a0da-65a7febfe450/{z}/{x}/{y}'],

            'params_config': [],
            'type': 'raster'
          },
          'legendConfig': {
            'items': [
              {
                'color': '#8c510a',
                'value': '0'
              },
              {
                'color': '#d8b365',
                'value': ''
              },
              {
                'color': '#e6f598',
                'value': ''
              },
              {
                'color': '#91cf60',
                'value': ''
              },
              {
                'color': '#31a354',
                'value': ''
              },
              {
                'color': '#006837',
                'value': '1'
              }
            ],
            'type': 'gradient'
          },
          'interactionConfig': {},
          'applicationConfig': {
            'active': true,
            'default': true,
            'global': true
          },
          'staticImageConfig': {}
        },
        'organization': 'UNBL',
        'createdAt': '2020-06-26T14:41:47.326Z',
        'updatedAt': '2020-06-30T21:10:36.529Z',
        'id': '67f46274-445c-46d8-a0da-65a7febfe450'
      },
      {
        'category': [
          'Land Cover'
        ],
        'published': true,
        'version': 2,
        'references': [],
        'slug': 'modis-evi-2011',
        'name': 'MODIS EVI 2011',
        'description': '',
        'type': 'raster',
        'provider': 'gee',
        'config': {
          'source': {
            'assetId': 'projects/earthpulse-sandbox/assets/layers/modis_evi_2011',

            'maxNativeZoom': 13,
            'maxzoom': 19,
            'minNativeZoom': 4,
            'minzoom': 2,
            'sldValue': '<RasterSymbolizer><ColorMap type="ramp" extended="false" ><ColorMapEntry color="#ebebe8" quantity="-9999" opacity="0" label="NoData"/><ColorMapEntry color="#8c510a" quantity="0" label="0"/><ColorMapEntry color="#d8b365" quantity="2" label="" /><ColorMapEntry color="#e6f598" quantity="4" label="" /><ColorMapEntry color="#91cf60" quantity="6" label="" /><ColorMapEntry color="#31a354" quantity="12" label="" /><ColorMapEntry color="#006837" quantity="15" label="1" /></ColorMap></RasterSymbolizer>',
            'styleType': 'sld',
            'tiles': ['https://d123t7ufog14bq.cloudfront.net/services/api/v1/tiles/234c09f3-7103-430e-9a0c-486b37a2b9c2/{z}/{x}/{y}'],

            'params_config': [],
            'type': 'raster'
          },
          'legendConfig': {
            'items': [
              {
                'color': '#8c510a',
                'value': '0'
              },
              {
                'color': '#d8b365',
                'value': ''
              },
              {
                'color': '#e6f598',
                'value': ''
              },
              {
                'color': '#91cf60',
                'value': ''
              },
              {
                'color': '#31a354',
                'value': ''
              },
              {
                'color': '#006837',
                'value': '1'
              }
            ],
            'type': 'gradient'
          },
          'interactionConfig': {},
          'applicationConfig': {
            'active': true,
            'default': true,
            'global': true
          },
          'staticImageConfig': {}
        },
        'organization': 'UNBL',
        'createdAt': '2020-06-26T14:41:03.189Z',
        'updatedAt': '2020-06-30T21:09:53.998Z',
        'id': '234c09f3-7103-430e-9a0c-486b37a2b9c2'
      },
      {
        'category': [
          'Land Cover'
        ],
        'published': true,
        'version': 2,
        'references': [],
        'slug': 'modis-evi-2010',
        'name': 'MODIS EVI 2010',
        'description': '',
        'type': 'raster',
        'provider': 'gee',
        'config': {
          'source': {
            'assetId': 'projects/earthpulse-sandbox/assets/layers/modis_evi_2010',

            'maxNativeZoom': 13,
            'maxzoom': 19,
            'minNativeZoom': 4,
            'minzoom': 2,
            'sldValue': '<RasterSymbolizer><ColorMap type="ramp" extended="false" ><ColorMapEntry color="#ebebe8" quantity="-9999" opacity="0" label="NoData"/><ColorMapEntry color="#8c510a" quantity="0" label="0"/><ColorMapEntry color="#d8b365" quantity="2" label="" /><ColorMapEntry color="#e6f598" quantity="4" label="" /><ColorMapEntry color="#91cf60" quantity="6" label="" /><ColorMapEntry color="#31a354" quantity="12" label="" /><ColorMapEntry color="#006837" quantity="15" label="1" /></ColorMap></RasterSymbolizer>',
            'styleType': 'sld',
            'tiles': ['https://d123t7ufog14bq.cloudfront.net/services/api/v1/tiles/94cb3924-9d59-47f8-b835-fad97edf4ca1/{z}/{x}/{y}'],

            'params_config': [],
            'type': 'raster'
          },
          'legendConfig': {
            'items': [
              {
                'color': '#8c510a',
                'value': '0'
              },
              {
                'color': '#d8b365',
                'value': ''
              },
              {
                'color': '#e6f598',
                'value': ''
              },
              {
                'color': '#91cf60',
                'value': ''
              },
              {
                'color': '#31a354',
                'value': ''
              },
              {
                'color': '#006837',
                'value': '1'
              }
            ],
            'type': 'gradient'
          },
          'interactionConfig': {},
          'applicationConfig': {
            'active': true,
            'default': true,
            'global': true
          },
          'staticImageConfig': {}
        },
        'organization': 'UNBL',
        'createdAt': '2020-06-26T14:40:34.743Z',
        'updatedAt': '2020-06-30T21:06:01.191Z',
        'id': '94cb3924-9d59-47f8-b835-fad97edf4ca1'
      },
      {
        'category': [
          'Land Cover'
        ],
        'published': true,
        'version': 2,
        'references': [],
        'slug': 'modis-evi-2009',
        'name': 'MODIS EVI 2009',
        'description': '',
        'type': 'raster',
        'provider': 'gee',
        'config': {
          'source': {
            'assetId': 'projects/earthpulse-sandbox/assets/layers/modis_evi_2009',

            'maxNativeZoom': 13,
            'maxzoom': 19,
            'minNativeZoom': 4,
            'minzoom': 2,
            'sldValue': '<RasterSymbolizer><ColorMap type="ramp" extended="false" ><ColorMapEntry color="#ebebe8" quantity="-9999" opacity="0" label="NoData"/><ColorMapEntry color="#8c510a" quantity="0" label="0"/><ColorMapEntry color="#d8b365" quantity="2" label="" /><ColorMapEntry color="#e6f598" quantity="4" label="" /><ColorMapEntry color="#91cf60" quantity="6" label="" /><ColorMapEntry color="#31a354" quantity="12" label="" /><ColorMapEntry color="#006837" quantity="15" label="1" /></ColorMap></RasterSymbolizer>',
            'styleType': 'sld',
            'tiles': ['https://d123t7ufog14bq.cloudfront.net/services/api/v1/tiles/0b3d6e46-f5b6-4310-879c-df1fe1ce9cbd/{z}/{x}/{y}'],

            'params_config': [],
            'type': 'raster'
          },
          'legendConfig': {
            'items': [
              {
                'color': '#8c510a',
                'value': '0'
              },
              {
                'color': '#d8b365',
                'value': ''
              },
              {
                'color': '#e6f598',
                'value': ''
              },
              {
                'color': '#91cf60',
                'value': ''
              },
              {
                'color': '#31a354',
                'value': ''
              },
              {
                'color': '#006837',
                'value': '1'
              }
            ],
            'type': 'gradient'
          },
          'interactionConfig': {},
          'applicationConfig': {
            'active': true,
            'default': true,
            'global': true
          },
          'staticImageConfig': {}
        },
        'organization': 'UNBL',
        'createdAt': '2020-06-26T14:39:54.618Z',
        'updatedAt': '2020-06-30T21:06:25.753Z',
        'id': '0b3d6e46-f5b6-4310-879c-df1fe1ce9cbd'
      },
      {
        'category': [
          'Land Cover'
        ],
        'published': true,
        'version': 2,
        'references': [],
        'slug': 'modis-evi-2008',
        'name': 'MODIS EVI 2008',
        'description': '',
        'type': 'raster',
        'provider': 'gee',
        'config': {
          'source': {
            'assetId': 'projects/earthpulse-sandbox/assets/layers/modis_evi_2008',
            'maxNativeZoom': 13,
            'maxzoom': 19,
            'minNativeZoom': 4,
            'minzoom': 2,
            'sldValue': '<RasterSymbolizer><ColorMap type="ramp" extended="false" ><ColorMapEntry color="#ebebe8" quantity="-9999" opacity="0" label="NoData"/><ColorMapEntry color="#8c510a" quantity="0" label="0"/><ColorMapEntry color="#d8b365" quantity="2" label="" /><ColorMapEntry color="#e6f598" quantity="4" label="" /><ColorMapEntry color="#91cf60" quantity="6" label="" /><ColorMapEntry color="#31a354" quantity="12" label="" /><ColorMapEntry color="#006837" quantity="15" label="1" /></ColorMap></RasterSymbolizer>',
            'styleType': 'sld',
            'tiles': ['https://d123t7ufog14bq.cloudfront.net/services/api/v1/tiles/721e672b-06dd-41f1-81db-f062a8f565ec/{z}/{x}/{y}'],
            'params_config': [],
            'type': 'raster'
          },
          'legendConfig': {
            'items': [
              {
                'color': '#8c510a',
                'value': '0'
              },
              {
                'color': '#d8b365',
                'value': ''
              },
              {
                'color': '#e6f598',
                'value': ''
              },
              {
                'color': '#91cf60',
                'value': ''
              },
              {
                'color': '#31a354',
                'value': ''
              },
              {
                'color': '#006837',
                'value': '1'
              }
            ],
            'type': 'gradient'
          },
          'interactionConfig': {},
          'applicationConfig': {
            'active': true,
            'default': true,
            'global': true
          },
          'staticImageConfig': {}
        },
        'organization': 'UNBL',
        'createdAt': '2020-06-26T14:39:12.145Z',
        'updatedAt': '2020-06-30T20:58:23.375Z',
        'id': '721e672b-06dd-41f1-81db-f062a8f565ec'
      },
      {
        'category': [
          'Land Cover'
        ],
        'published': true,
        'version': 3,
        'references': [],
        'slug': 'modis-evi-2007',
        'name': 'MODIS EVI 2007',
        'description': '',
        'type': 'raster',
        'provider': 'gee',
        'config': {
          'source': {
            'assetId': 'projects/earthpulse-sandbox/assets/layers/modis_evi_2007',
            'maxNativeZoom': 13,
            'maxzoom': 19,
            'minNativeZoom': 4,
            'minzoom': 2,
            'sldValue': '<RasterSymbolizer><ColorMap type="ramp" extended="false" ><ColorMapEntry color="#ebebe8" quantity="-9999" opacity="0" label="NoData"/><ColorMapEntry color="#8c510a" quantity="0" label="0"/><ColorMapEntry color="#d8b365" quantity="2" label="" /><ColorMapEntry color="#e6f598" quantity="4" label="" /><ColorMapEntry color="#91cf60" quantity="6" label="" /><ColorMapEntry color="#31a354" quantity="12" label="" /><ColorMapEntry color="#006837" quantity="15" label="1" /></ColorMap></RasterSymbolizer>',
            'styleType': 'sld',
            'tiles': ['https://d123t7ufog14bq.cloudfront.net/services/api/v1/tiles/12ad3503-a647-43fc-ad05-5adc45ddcfd1/{z}/{x}/{y}'],
            'params_config': [],
            'type': 'raster'
          },
          'legendConfig': {
            'items': [
              {
                'color': '#8c510a',
                'value': '0'
              },
              {
                'color': '#d8b365',
                'value': ''
              },
              {
                'color': '#e6f598',
                'value': ''
              },
              {
                'color': '#91cf60',
                'value': ''
              },
              {
                'color': '#31a354',
                'value': ''
              },
              {
                'color': '#006837',
                'value': '1'
              }
            ],
            'type': 'gradient'
          },
          'interactionConfig': {},
          'applicationConfig': {
            'active': true,
            'default': true,
            'global': true
          },
          'staticImageConfig': {}
        },
        'organization': 'UNBL',
        'createdAt': '2020-06-26T14:38:35.178Z',
        'updatedAt': '2020-06-30T20:59:04.233Z',
        'id': '12ad3503-a647-43fc-ad05-5adc45ddcfd1'
      },
      {
        'category': [
          'Land Cover'
        ],
        'published': true,
        'version': 2,
        'references': [],
        'slug': 'modis-evi-2006',
        'name': 'MODIS EVI 2006',
        'description': '',
        'type': 'raster',
        'provider': 'gee',
        'config': {
          'source': {
            'assetId': 'projects/earthpulse-sandbox/assets/layers/modis_evi_2006',
            'maxNativeZoom': 13,
            'maxzoom': 19,
            'minNativeZoom': 4,
            'minzoom': 2,
            'sldValue': '<RasterSymbolizer><ColorMap type="ramp" extended="false" ><ColorMapEntry color="#ebebe8" quantity="-9999" opacity="0" label="NoData"/><ColorMapEntry color="#8c510a" quantity="0" label="0"/><ColorMapEntry color="#d8b365" quantity="2" label="" /><ColorMapEntry color="#e6f598" quantity="4" label="" /><ColorMapEntry color="#91cf60" quantity="6" label="" /><ColorMapEntry color="#31a354" quantity="12" label="" /><ColorMapEntry color="#006837" quantity="15" label="1" /></ColorMap></RasterSymbolizer>',
            'styleType': 'sld',
            'tiles': 'https://d123t7ufog14bq.cloudfront.net/services/api/v1/tiles/d5712e40-2f2a-4862-a61b-9b8dc5677b17/{z}/{x}/{y}',
            'params_config': [],
            'type': 'raster'
          },
          'legendConfig': {
            'items': [
              {
                'color': '#8c510a',
                'value': '0'
              },
              {
                'color': '#d8b365',
                'value': ''
              },
              {
                'color': '#e6f598',
                'value': ''
              },
              {
                'color': '#91cf60',
                'value': ''
              },
              {
                'color': '#31a354',
                'value': ''
              },
              {
                'color': '#006837',
                'value': '1'
              }
            ],
            'type': 'gradient'
          },
          'interactionConfig': {},
          'applicationConfig': {
            'active': true,
            'default': true,
            'global': true
          },
          'staticImageConfig': {}
        },
        'organization': 'UNBL',
        'createdAt': '2020-06-26T14:37:54.969Z',
        'updatedAt': '2020-06-30T20:49:48.515Z',
        'id': 'd5712e40-2f2a-4862-a61b-9b8dc5677b17'
      },
      {
        'category': [
          'Land Cover'
        ],
        'published': true,
        'version': 2,
        'references': [],
        'slug': 'modis-evi-2005',
        'name': 'MODIS EVI 2005',
        'description': '',
        'type': 'raster',
        'provider': 'gee',
        'config': {
          'source': {
            'assetId': 'projects/earthpulse-sandbox/assets/layers/modis_evi_2005',
            'maxNativeZoom': 13,
            'maxzoom': 19,
            'minNativeZoom': 4,
            'minzoom': 2,
            'sldValue': '<RasterSymbolizer><ColorMap type="ramp" extended="false" ><ColorMapEntry color="#ebebe8" quantity="-9999" opacity="0" label="NoData"/><ColorMapEntry color="#8c510a" quantity="0" label="0"/><ColorMapEntry color="#d8b365" quantity="2" label="" /><ColorMapEntry color="#e6f598" quantity="4" label="" /><ColorMapEntry color="#91cf60" quantity="6" label="" /><ColorMapEntry color="#31a354" quantity="12" label="" /><ColorMapEntry color="#006837" quantity="15" label="1" /></ColorMap></RasterSymbolizer>',
            'styleType': 'sld',
            'tiles': ['https://d123t7ufog14bq.cloudfront.net/services/api/v1/tiles/67c6704d-35de-4874-98dd-e86ee36f71d2/{z}/{x}/{y}'],
            'params_config': [],
            'type': 'raster'
          },
          'legendConfig': {
            'items': [
              {
                'color': '#8c510a',
                'value': '0'
              },
              {
                'color': '#d8b365',
                'value': ''
              },
              {
                'color': '#e6f598',
                'value': ''
              },
              {
                'color': '#91cf60',
                'value': ''
              },
              {
                'color': '#31a354',
                'value': ''
              },
              {
                'color': '#006837',
                'value': '1'
              }
            ],
            'type': 'gradient'
          },
          'interactionConfig': {},
          'applicationConfig': {
            'active': true,
            'default': true,
            'global': true
          },
          'staticImageConfig': {}
        },
        'organization': 'UNBL',
        'createdAt': '2020-06-26T14:36:48.698Z',
        'updatedAt': '2020-06-30T20:46:51.622Z',
        'id': '67c6704d-35de-4874-98dd-e86ee36f71d2'
      },
      {
        'category': [
          'Land Cover'
        ],
        'published': true,
        'version': 2,
        'references': [],
        'slug': 'modis-evi-2004',
        'name': 'MODIS EVI 2004',
        'description': '',
        'type': 'raster',
        'provider': 'gee',
        'config': {
          'source': {
            'assetId': 'projects/earthpulse-sandbox/assets/layers/modis_evi_2004',

            'maxNativeZoom': 13,
            'maxzoom': 19,
            'minNativeZoom': 4,
            'minzoom': 2,
            'sldValue': '<RasterSymbolizer><ColorMap type="ramp" extended="false" ><ColorMapEntry color="#ebebe8" quantity="-9999" opacity="0" label="NoData"/><ColorMapEntry color="#8c510a" quantity="0" label="0"/><ColorMapEntry color="#d8b365" quantity="2" label="" /><ColorMapEntry color="#e6f598" quantity="4" label="" /><ColorMapEntry color="#91cf60" quantity="6" label="" /><ColorMapEntry color="#31a354" quantity="12" label="" /><ColorMapEntry color="#006837" quantity="15" label="1" /></ColorMap></RasterSymbolizer>',
            'styleType': 'sld',
            'tiles': ['https://d123t7ufog14bq.cloudfront.net/services/api/v1/tiles/eda70bd0-82a0-48dd-9a2f-e4332e397080/{z}/{x}/{y}'],

            'params_config': [],
            'type': 'raster'
          },
          'legendConfig': {
            'items': [
              {
                'color': '#8c510a',
                'value': '0'
              },
              {
                'color': '#d8b365',
                'value': ''
              },
              {
                'color': '#e6f598',
                'value': ''
              },
              {
                'color': '#91cf60',
                'value': ''
              },
              {
                'color': '#31a354',
                'value': ''
              },
              {
                'color': '#006837',
                'value': '1'
              }
            ],
            'type': 'gradient'
          },
          'interactionConfig': {},
          'applicationConfig': {
            'active': true,
            'default': true,
            'global': true
          },
          'staticImageConfig': {}
        },
        'organization': 'UNBL',
        'createdAt': '2020-06-26T14:35:52.319Z',
        'updatedAt': '2020-06-30T20:45:25.448Z',
        'id': 'eda70bd0-82a0-48dd-9a2f-e4332e397080'
      },
      {
        'category': [
          'Land Cover'
        ],
        'published': true,
        'version': 3,
        'references': [],
        'slug': 'modis-evi-2003',
        'name': 'MODIS EVI 2003',
        'description': '',
        'type': 'raster',
        'provider': 'gee',
        'config': {
          'source': {
            'assetId': 'projects/earthpulse-sandbox/assets/layers/modis_evi_2003',
            'maxNativeZoom': 13,
            'maxzoom': 19,
            'minNativeZoom': 4,
            'minzoom': 2,
            'sldValue': '<RasterSymbolizer><ColorMap type="ramp" extended="false" ><ColorMapEntry color="#ebebe8" quantity="-9999" opacity="0" label="NoData"/><ColorMapEntry color="#8c510a" quantity="0" label="0"/><ColorMapEntry color="#d8b365" quantity="2" label="" /><ColorMapEntry color="#e6f598" quantity="4" label="" /><ColorMapEntry color="#91cf60" quantity="6" label="" /><ColorMapEntry color="#31a354" quantity="12" label="" /><ColorMapEntry color="#006837" quantity="15" label="1" /></ColorMap></RasterSymbolizer>',
            'styleType': 'sld',
            'tiles': ['https://d123t7ufog14bq.cloudfront.net/services/api/v1/tiles/1acf0ea7-1a4f-4aad-a8e2-04e744358808/{z}/{x}/{y}'],
            'params_config': [],
            'type': 'raster'
          },
          'legendConfig': {
            'items': [
              {
                'color': '#8c510a',
                'value': '0'
              },
              {
                'color': '#d8b365',
                'value': ''
              },
              {
                'color': '#e6f598',
                'value': ''
              },
              {
                'color': '#91cf60',
                'value': ''
              },
              {
                'color': '#31a354',
                'value': ''
              },
              {
                'color': '#006837',
                'value': '1'
              }
            ],
            'type': 'gradient'
          },
          'interactionConfig': {},
          'applicationConfig': {
            'active': true,
            'default': true,
            'global': true
          },
          'staticImageConfig': {}
        },
        'organization': 'UNBL',
        'createdAt': '2020-06-26T14:32:12.413Z',
        'updatedAt': '2020-06-30T20:45:50.944Z',
        'id': '1acf0ea7-1a4f-4aad-a8e2-04e744358808'
      },
      {
        'category': [
          'Land Cover'
        ],
        'published': true,
        'version': 2,
        'references': [],
        'name': 'MODIS EVI 2002',
        'slug': 'modis-evi-2002',
        'type': 'raster',
        'provider': 'gee',
        'config': {
          'source': {
            'assetId': 'projects/earthpulse-sandbox/assets/layers/modis_evi_2002',

            'maxNativeZoom': 13,
            'maxzoom': 19,
            'minNativeZoom': 4,
            'minzoom': 2,
            'sldValue': '<RasterSymbolizer><ColorMap type="ramp" extended="false" ><ColorMapEntry color="#ebebe8" quantity="-9999" opacity="0" label="NoData"/><ColorMapEntry color="#8c510a" quantity="0" label="0"/><ColorMapEntry color="#d8b365" quantity="2" label="" /><ColorMapEntry color="#e6f598" quantity="4" label="" /><ColorMapEntry color="#91cf60" quantity="6" label="" /><ColorMapEntry color="#31a354" quantity="12" label="" /><ColorMapEntry color="#006837" quantity="15" label="1" /></ColorMap></RasterSymbolizer>',
            'styleType': 'sld',
            'tiles': ['https://d123t7ufog14bq.cloudfront.net/services/api/v1/tiles/a64f2e62-f0fd-4e91-b9cb-2e3f1d856539/{z}/{x}/{y}'],
            'params_config': [],
            'type': 'raster'
          },
          'legendConfig': {
            'items': [
              {
                'color': '#8c510a',
                'value': '0'
              },
              {
                'color': '#d8b365',
                'value': ''
              },
              {
                'color': '#e6f598',
                'value': ''
              },
              {
                'color': '#91cf60',
                'value': ''
              },
              {
                'color': '#31a354',
                'value': ''
              },
              {
                'color': '#006837',
                'value': '1'
              }
            ],
            'type': 'gradient'
          },
          'interactionConfig': {},
          'applicationConfig': {
            'active': true,
            'default': true,
            'global': true
          },
          'staticImageConfig': {}
        },
        'organization': 'UNBL',
        'createdAt': '2020-06-26T14:28:30.719Z',
        'updatedAt': '2020-06-30T20:42:28.928Z',
        'id': 'a64f2e62-f0fd-4e91-b9cb-2e3f1d856539'
      },
      {
        'category': [
          'Land Cover'
        ],
        'published': true,
        'version': 2,
        'references': [],
        'name': 'MODIS EVI 2001',
        'slug': 'modis-evi-2001',
        'type': 'raster',
        'provider': 'gee',
        'config': {
          'source': {
            'assetId': 'projects/earthpulse-sandbox/assets/layers/modis_evi_2001',

            'maxNativeZoom': 13,
            'maxzoom': 19,
            'minNativeZoom': 4,
            'minzoom': 2,
            'sldValue': '<RasterSymbolizer><ColorMap type="ramp" extended="false" ><ColorMapEntry color="#ebebe8" quantity="-9999" opacity="0" label="NoData"/><ColorMapEntry color="#8c510a" quantity="0" label="0"/><ColorMapEntry color="#d8b365" quantity="2" label="" /><ColorMapEntry color="#e6f598" quantity="4" label="" /><ColorMapEntry color="#91cf60" quantity="6" label="" /><ColorMapEntry color="#31a354" quantity="12" label="" /><ColorMapEntry color="#006837" quantity="15" label="1" /></ColorMap></RasterSymbolizer>',
            'styleType': 'sld',
            'tiles': ['https://d123t7ufog14bq.cloudfront.net/services/api/v1/tiles/435d6057-7cd8-4d6b-b13f-e840ca33f488/{z}/{x}/{y}'],

            'params_config': [],
            'type': 'raster'
          },
          'legendConfig': {
            'items': [
              {
                'color': '#8c510a',
                'value': '0'
              },
              {
                'color': '#d8b365',
                'value': ''
              },
              {
                'color': '#e6f598',
                'value': ''
              },
              {
                'color': '#91cf60',
                'value': ''
              },
              {
                'color': '#31a354',
                'value': ''
              },
              {
                'color': '#006837',
                'value': '1'
              }
            ],
            'type': 'gradient'
          },
          'interactionConfig': {},
          'applicationConfig': {
            'active': true,
            'default': true,
            'global': true
          },
          'staticImageConfig': {}
        },
        'organization': 'UNBL',
        'createdAt': '2020-06-26T14:26:13.058Z',
        'updatedAt': '2020-06-30T20:41:48.918Z',
        'id': '435d6057-7cd8-4d6b-b13f-e840ca33f488'
      },
      {
        'category': [
          'Land Cover'
        ],
        'published': true,
        'version': 3,
        'references': [],
        'description': '',
        'name': 'MODIS EVI 2000',
        'slug': 'modis-evi-2000',
        'type': 'raster',
        'provider': 'gee',
        'config': {
          'source': {
            'assetId': 'projects/earthpulse-sandbox/assets/layers/modis_evi_2000',

            'maxNativeZoom': 13,
            'maxzoom': 19,
            'minNativeZoom': 4,
            'minzoom': 2,
            'sldValue': '<RasterSymbolizer><ColorMap type="ramp" extended="false" ><ColorMapEntry color="#ebebe8" quantity="-9999" opacity="0" label="NoData"/><ColorMapEntry color="#8c510a" quantity="0" label="0"/><ColorMapEntry color="#d8b365" quantity="2" label="" /><ColorMapEntry color="#e6f598" quantity="4" label="" /><ColorMapEntry color="#91cf60" quantity="6" label="" /><ColorMapEntry color="#31a354" quantity="12" label="" /><ColorMapEntry color="#006837" quantity="15" label="1" /></ColorMap></RasterSymbolizer>',
            'styleType': 'sld',
            'url': ['https://d123t7ufog14bq.cloudfront.net/services/api/v1/tiles/cd955b29-612c-4623-b5b3-43e0cf7ab91c/{z}/{x}/{y}'],

            'params_config': [],
            'type': 'raster'
          },
          'legendConfig': {
            'items': [
              {
                'color': '#8c510a',
                'value': '0'
              },
              {
                'color': '#d8b365',
                'value': ''
              },
              {
                'color': '#e6f598',
                'value': ''
              },
              {
                'color': '#91cf60',
                'value': ''
              },
              {
                'color': '#31a354',
                'value': ''
              },
              {
                'color': '#006837',
                'value': '1'
              }
            ],
            'type': 'gradient'
          },
          'interactionConfig': {},
          'applicationConfig': {
            'active': true,
            'default': true,
            'global': true
          },
          'staticImageConfig': {}
        },
        'organization': 'UNBL',
        'createdAt': '2020-06-26T14:22:03.103Z',
        'updatedAt': '2020-06-30T20:41:14.452Z',
        'id': 'cd955b29-612c-4623-b5b3-43e0cf7ab91c'
      }
    ]
  },
  {
    id: 'loss',
    slug: 'tree-loss',
    name: 'tree loss',
    type: 'raster',
    config: {
      source: {
        type: 'raster',
        tiles: [
          `https://storage.googleapis.com/wri-public/Hansen_16/tiles/hansen_world/v1/tc30/{z}/{x}/{y}.png`
        ],
        minzoom: 3,
        maxzoom: 12
      },
      decodeParams: {
        startYear: 2001,
        endYear: 2018
      },
      legendConfig: {
        'type': 'basic',
        'items': [
          {
            'notes': [
              'Displaying loss with {thresh} canopy density.',
              'Tree cover loss is not always deforestation.'
            ],
            'source': '(annual, 30m, global, Hansen/UMD/Google/USGS/NASA)',
            'name': 'Tree cover loss',
            'color': '#DC6C9A',
            'threshold': 30,
            'dataMaxZoom': 12
          }
        ]
      },
      timelineConfig: {
        'step': 1,
        'speed': 250,
        'interval': 'years',
        'dateFormat': 'YYYY',
        'trimEndDate': '2018-12-31',
        'maxDate': '2018-12-31',
        'minDate': '2001-01-01',
        'canPlay': true,
        'railStyle': {
          'background': '#FFF'
        },
        'trackStyle': [
          {
            'background': '#dc6c9a'
          },
          {
            'background': '#982d5f'
          }
        ]
      },
      'decodeConfig': {
        'type': 'treeCoverLoss',
        'values': [
          {
            'default': '2001-01-01',
            'key': 'startDate',
            'required': true
          },
          {
            'default': '2018-12-31',
            'key': 'endDate',
            'required': true
          }
        ]
      },
      paramsConfig: [
        {
          'default': 12,
          'key': 'dataMaxZoom',
          'required': true
        },
        {
          'default': 30,
          'key': 'thresh',
          'required': true
        }
      ],
      decodeFunction: `
      // values for creating power scale, domain (input), and range (output)
      float domainMin = 0.;
      float domainMax = 255.;
      float rangeMin = 0.;
      float rangeMax = 255.;

      float exponent = zoom < 13. ? 0.3 + (zoom - 3.) / 20. : 1.;
      float intensity = color.r * 255.;

      // get the min, max, and current values on the power scale
      float minPow = pow(domainMin, exponent - domainMin);
      float maxPow = pow(domainMax, exponent);
      float currentPow = pow(intensity, exponent);

      // get intensity value mapped to range
      float scaleIntensity = ((currentPow - minPow) / (maxPow - minPow) * (rangeMax - rangeMin)) + rangeMin;
      // a value between 0 and 255
      alpha = zoom < 13. ? scaleIntensity / 255. : color.g;

      float year = 2000.0 + (color.b * 255.);
      // map to years
      if (year >= startYear && year <= endYear && year >= 2001.) {
        color.r = 220. / 255.;
        color.g = (72. - zoom + 102. - 3. * scaleIntensity / zoom) / 255.;
        color.b = (33. - zoom + 153. - intensity / zoom) / 255.;
      } else {
        alpha = 0.;
      }
    `

    }
  }]
;

export function* preloadLayers({payload}) {
  const group = yield select(getGroup);

  try {
    const indexes: IIndex[] = yield call(fetchDataIndexes, {
      ...DATA_INDEX_QUERY,
      ...{group: group.toString()},
    });
    const widgets = indexes.reduce((acc, index) => {
      return [...acc, ...index.widgets];
    }, []);
    const adaptedWidgets = widgets.map(setWidget);
    yield put(setWidgets(adaptedWidgets));
    yield put(
      setIndexesList(
        sortBy(indexes, (dil) => {
          const {name} = dil;
          return name;
        })
      )
    );

    // get layers from all dashboards; cannot use the layer api because that contains sublayers too
    let layers = LAYERS;
    // indexes.forEach((index) => {
    //   layers = LAYERS;
    // });

    if (!!layers) {
      const layerListGroups = yield fetchLayerGroups(layers);

      yield put(setLayersList(layerListGroups));
    }
  } catch (e) {
    // TODO better error handling for sagas
    if (e.response.status === 403) {
      replace('/404');
    } else {
      yield put(setWidgets([]));
      yield put(setWidgetsLoading(false));
      yield put(setWidgetsError(e));
    }
  }
}

function* fetchLayerGroups(layers: any) {
  return yield all(layers.map((layer: ILayer) => setLayer(layer)));
}

function setWidget(widget: IWidget) {
  const adaptedWidget = {...widget, ...widget.config};
  delete adaptedWidget.config;

  return adaptedWidget;
}

function setLayer(layer) {
  const adaptedLayer = {...layer, ...layer.config};

  delete adaptedLayer.config;

  if (!!adaptedLayer.references && adaptedLayer.references.length) {
    //todo wtf
    const adaptedReferences = layer.references.map((layer) => {
      const puff = {...layer, ...layer.config};
      delete layer.config;
      return puff;
    });


    console.log(adaptedReferences);
    const coco = {
      ...adaptedLayer,
      references: adaptedReferences
    };
    console.log(coco, 'in ref');
    return coco;

  }


  console.log(adaptedLayer, 'dupa');

  return {
    ...adaptedLayer,
  };
}
