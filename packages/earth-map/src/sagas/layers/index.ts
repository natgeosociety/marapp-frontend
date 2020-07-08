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
