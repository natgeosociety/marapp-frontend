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

    'id': '526d2cc8-443b-4e20-a8c9-5ea4fd45d3f7',
    'slug': 'modis-fires-unbl',
    'name': 'MODIS fires',
    'description': '<p>The MODIS burned area mapping algorithm takes advantage of spectral, temporal, and structural changes&nbsp; characterized by deposits of charcoal and ash, removal of vegetation, and alteration of the vegetation structure (Pereira et al.,1997, Roy et al., 1999).</p><p>It detects the approximate date of burning at 500m by locating the occurrence of rapid changes in daily surface reflectance time series data. The algorithm maps the spatial extent of recent fires and has been aggregated on a weekly scale.</p><p>Learn More</p><p><a href="http://modis-fire.umd.edu/">Read about and download the Data</a></p><p>Source(s)</p><p>National Aeronautics and Space Administration (NASA)</p><p>Suggested Citation &nbsp;</p><p>L. Giglio, C. Justice, L. Boschetti, D. Roy. 2015. MCD64A1 MODIS/Terra+Aqua Burned Area Monthly L3 Global 500m SIN Grid V006. NASA EOSDIS Land Processes DAAC. https://doi.org/10.5067/MODIS/MCD64A1.006</p><p>License</p><p><a href="https://earthdata.nasa.gov/earth-observation-data/near-real-time/citation"><i>We acknowledge the use of data and imagery from LANCE FIRMS operated by NASA\'s Earth Science Data and Information System (ESDIS) with funding provided by NASA Headquarters.</i></a></p>',
    'type': 'raster',
    'provider': 'gee',
    'category': [
      'Natural Hazards'
    ],
    'config': {
      'source': {
        'type': 'raster',
        'minzoom': 2,
        'maxzoom': 19
      },
      'timelineConfig': {
        'railStyle': {
          'background': '#333'
        },
        'trackStyle': [
          {
            'background': '#f79a28',
            'top': '50%',
            'transform': 'translate(0, -50%)',
            'height': 12,
            'borderRadius': 0,
            'gradient': {
              '{year}0101': '#5A0000',
              '{year}0201': '#7F0101',
              '{year}0301': '#9B0E01',
              '{year}0401': '#BA1001',
              '{year}0501': '#D51301',
              '{year}0601': '#FA1500',
              '{year}0701': '#FF5900',
              '{year}0801': '#FF7E00',
              '{year}0901': '#FFA300',
              '{year}1001': '#FFC800',
              '{year}1101': '#FFEB00',
              '{year}1201': '#FFFF00'
            }
          },
          {
            'background': '#999',
            'top': '50%',
            'transform': 'translate(0, -50%)',
            'borderRadius': 0
          }
        ],
        'handleStyle': {
          'opacity': 0
        },
        'step': 1,
        'speed': 75,
        'interval': 'days',
        'dateFormat': 'YYYY-MM-DD',
        'trimEndDate': '{year}-12-31',
        'maxDate': '{year}-12-31',
        'minDate': '{year}-01-01',
        'canPlay': true
      },
      'paramsConfig': [
        {
          'required': true,
          'key': 'year',
          'default': '2018'
        }
      ],
      'decodeConfig': {
        'type': 'fire',
        'values': [
          {
            'required': true,
            'key': 'startDate',
            'default': '2018-01-01'
          },
          {
            'required': true,
            'key': 'endDate',
            'default': '2018-12-31'
          },
          {
            'required': true,
            'key': 'maxAbsoluteDate',
            'default': '2018-07-31'
          },
          {
            'required': true,
            'key': 'minAbsoluteDate',
            'default': '2001-01-01'
          }
        ]
      },
      'legendConfig': {
        'enable': true,
        'legendType': 'yearpicker'
      },
      'interactionConfig': {},
      'applicationConfig': {},
      'staticImageConfig': {}
    },
    'organization': 'UNBL',
    'published': true,
    'createdAt': '2020-06-25T14:27:20.377Z',
    'updatedAt': '2020-06-26T13:07:29.866Z',
    'version': 6,
    'references': [
      {
        'category': [
          'Natural Hazards'
        ],
        'published': true,
        'version': 9,
        'references': [],
        'name': 'MODIS fires 2018',
        'slug': 'modis-fires-2018-unbl',
        'type': 'raster',
        'provider': 'gee',
        'config': {
          'source': {
            'assetId': 'projects/earthpulse-sandbox/assets/layers/modis_fires_2018',
            'maxNativeZoom': 13,
            'maxzoom': 19,
            'minNativeZoom': 4,
            'minzoom': 2,
            'sldValue': '',
            'styleType': 'sld',
            'tiles': ['https://d123t7ufog14bq.cloudfront.net/services/api/v1/tiles/6f55f734-5789-4bd9-8037-449574d09e3c/{z}/{x}/{y}'],
            'params_config': [],
            'type': 'raster'
          },
          'timelineConfig': {
            'railStyle': {
              'background': '#333'
            },
            'trackStyle': [
              {
                'background': '#f79a28',
                'top': '50%',
                'transform': 'translate(0, -50%)',
                'height': 12,
                'borderRadius': 0,
                'gradient': {
                  '{year}0101': '#5A0000',
                  '{year}0201': '#7F0101',
                  '{year}0301': '#9B0E01',
                  '{year}0401': '#BA1001',
                  '{year}0501': '#D51301',
                  '{year}0601': '#FA1500',
                  '{year}0701': '#FF5900',
                  '{year}0801': '#FF7E00',
                  '{year}0901': '#FFA300',
                  '{year}1001': '#FFC800',
                  '{year}1101': '#FFEB00',
                  '{year}1201': '#FFFF00'
                }
              },
              {
                'background': '#999',
                'top': '50%',
                'transform': 'translate(0, -50%)',
                'borderRadius': 0
              }
            ],
            'handleStyle': {
              'opacity': 0
            },
            'step': 1,
            'speed': 75,
            'interval': 'days',
            'dateFormat': 'YYYY-MM-DD',
            'trimEndDate': '{year}-12-31',
            'maxDate': '{year}-12-31',
            'minDate': '{year}-01-01',
            'canPlay': true
          },
          'paramsConfig': [
            {
              'required': true,
              'key': 'year',
              'default': '2018',
              'year': '2018'
            }
          ],
          'decodeConfig': {
            'type': 'fire',
            'values': [
              {
                'required': true,
                'key': 'startDate',
                'default': '2018-01-01'
              },
              {
                'required': true,
                'key': 'endDate',
                'default': '2018-12-31'
              }
            ]
          },
          'legendConfig': {
            'legendType': 'yearpicker',
            'enable': true
          },
          'interactionConfig': {},
          'applicationConfig': {},
          'staticImageConfig': {}
        },
        'organization': 'UNBL',
        'createdAt': '2020-06-25T14:28:30.764Z',
        'updatedAt': '2020-06-30T20:09:38.835Z',
        'id': '6f55f734-5789-4bd9-8037-449574d09e3c'
      },
    ]
  }
]

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
    //   layers = [...layers, ...index.layers];
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
    const adaptedReferences = layer.references.map((layer) => {
      const tempLayer = {...layer, ...layer.config};
      delete layer.config;
      return tempLayer;
    });


    return {
      ...adaptedLayer,
      references: adaptedReferences
    };

  }


  return {
    ...adaptedLayer,
  };
}
