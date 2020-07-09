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
        'format': 'image/png',
        'options': {
          'useCors': true
        },
        'minzoom': 2,
        'maxzoom': 19,
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
          'default': '2019'
        }
      ],
      'decodeConfig': {
        'type': 'fire',
        'values': [
          {
            'required': true,
            'key': 'startDate',
            'default': '2019-01-01'
          },
          {
            'required': true,
            'key': 'endDate',
            'default': '2019-12-31'
          },
          {
            'required': true,
            'key': 'maxAbsoluteDate',
            'default': '2019-07-31'
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
        'legendType': 'yeardatepicker'
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
          source: {
            'tiles': ['https://d123t7ufog14bq.cloudfront.net/services/api/v1/tiles/6f55f734-5789-4bd9-8037-449574d09e3c/{z}/{x}/{y}'],
            'format': 'image/png',
            'options': {
              'useCors': true
            },
            'minzoom': 2,
            'maxzoom': 8,
            'type': 'raster',
          },
          'assetId': 'projects/earthpulse-sandbox/assets/layers/modis_fires_2018',
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
            'legendType': 'yeardatepicker',
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
      {
        'category': [
          'Natural Hazards'
        ],
        'published': true,
        'version': 9,
        'references': [],
        'name': 'MODIS fires 2017',
        'slug': 'modis-fires-2017-unbl',
        'type': 'raster',
        'provider': 'gee',
        'config': {
          source: {
            'tiles': ['https://d123t7ufog14bq.cloudfront.net/services/api/v1/tiles/6f55f734-5789-4bd9-8037-449574d09e3c/{z}/{x}/{y}'],
            'format': 'image/png',
            'options': {
              'useCors': true
            },
            'minzoom': 2,
            'maxzoom': 8,
            'type': 'raster',
          },
          'assetId': 'projects/earthpulse-sandbox/assets/layers/modis_fires_2018',
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
              'default': '2017',
              'year': '2017'
            }
          ],
          'decodeConfig': {
            'type': 'fire',
            'values': [
              {
                'required': true,
                'key': 'startDate',
                'default': '2017-01-01'
              },
              {
                'required': true,
                'key': 'endDate',
                'default': '2017-12-31'
              }
            ]
          },
          'legendConfig': {
            'legendType': 'yeardatepicker',
            'enable': true
          },
          'interactionConfig': {},
          'applicationConfig': {},
          'staticImageConfig': {}
        },
        'organization': 'UNBL',
        'createdAt': '2020-06-25T14:28:30.764Z',
        'updatedAt': '2020-06-30T20:09:38.835Z',
        'id': '6f55f734-5789-4bd9-80d7-449574d09e3c'
      }
    ]
  },
  {

    'id': '0a3a5d27-3c73-4009-9252-24b113a034e8',
    'slug': 'land-cover-esa-cci-2015',
    'name': 'Land Cover ESA CCI 2015',
    'description': '<p>Description</p><p>In the framework of the Climate Change Initiative (CCI) of the European Space Agency, the CCI Land Cover partnership released the CCI 300 m annual global land cover time series from 1992 to 2015. This map was created by reprocessing and interpreting five different satellite missions to assign a land use classification for every terrestrial area on Earth.&nbsp;</p><p>Learn More&nbsp;</p><p><a href="https://www.esa-landcover-cci.org/?q=node/175">ESA Landcover</a><br><br>&nbsp;</p><p><a href="http://maps.elie.ucl.ac.be/CCI/viewer/">Download the Data</a></p><p>Sources</p><p>European Space Agency (ESA)</p><p>European Space Agency Climate Change Initiative (ESA CCI)</p><p>University of Louvain (UCLouvain)</p><p>Suggested Citation</p><p>European Space Agency Climate Change Initiative, Land Cover project. 2017. "300 M Annual Global Land Cover Time Series from 1992 to 2015." Retrieved from <a href="https://www.esa-landcover-cci.org/?q=node/175">https://www.esa-landcover-cci.org/?q=node/175</a>.&nbsp;</p><p>License</p><p><a href="http://maps.elie.ucl.ac.be/CCI/viewer/download.php">Attribution Required</a></p>',
    'type': 'raster',
    'provider': 'gee',
    'category': [
      'Land Cover'
    ],
    'config': {
      'source': {
        'assetId': 'projects/earthpulse-sandbox/assets/layers/ESACCI-LC-L4-300m_2015',
        'sldValue': '<RasterSymbolizer> <ColorMap type="intervals" extended="false"> <ColorMapEntry color="#356122" label="Forest" quantity="50" opacity="1" /> + <ColorMapEntry color="#356122" label="Forest" quantity="51" opacity="1" /> + <ColorMapEntry color="#356122" label="Forest" quantity="52" opacity="1" /> + <ColorMapEntry color="#356122" label="Forest" quantity="60" opacity="1" /> + <ColorMapEntry color="#356122" label="Forest" quantity="61" opacity="1" /> + <ColorMapEntry color="#356122" label="Forest" quantity="62" opacity="1" /> + <ColorMapEntry color="#356122" label="Forest" quantity="70" opacity="1" /> + <ColorMapEntry color="#356122" label="Forest" quantity="71" opacity="1" /> + <ColorMapEntry color="#356122" label="Forest" quantity="72" opacity="1" /> + <ColorMapEntry color="#356122" label="Forest" quantity="80" opacity="1" /> + <ColorMapEntry color="#356122" label="Forest" quantity="81" opacity="1" /> + <ColorMapEntry color="#356122" label="Forest" quantity="82" opacity="1" /> + <ColorMapEntry color="#356122" label="Forest" quantity="90" opacity="1" /> + <ColorMapEntry color="#6f823b" label="Shrubland" quantity="100" opacity="1" /> + <ColorMapEntry color="#6f823b" label="Shrubland" quantity="110" opacity="1" /> + <ColorMapEntry color="#6f823b" label="Shrubland" quantity="120" opacity="1" /> + <ColorMapEntry color="#6f823b" label="Shrubland" quantity="121" opacity="1" /> + <ColorMapEntry color="#6f823b" label="Shrubland" quantity="122" opacity="1" /> + <ColorMapEntry color="#b2b881" label="Sparse vegetation" quantity="140" opacity="1" /> + <ColorMapEntry color="#b2b881" label="Sparse vegetation" quantity="150" opacity="1" /> + <ColorMapEntry color="#b2b881" label="Sparse vegetation" quantity="151" opacity="1" /> + <ColorMapEntry color="#b2b881" label="Sparse vegetation" quantity="152" opacity="1" /> + <ColorMapEntry color="#b2b881" label="Sparse vegetation" quantity="153" opacity="1" /> + <ColorMapEntry color="#9da321" label="Grassland" quantity="130" opacity="1" /> + <ColorMapEntry color="#3da096" label="Wetland" quantity="160" opacity="1" /> + <ColorMapEntry color="#3da096" label="Wetland" quantity="170" opacity="1" /> + <ColorMapEntry color="#3da096" label="Wetland" quantity="180" opacity="1" /> + <ColorMapEntry color="#17253d" label="Water" quantity="210" opacity="0" /> + <ColorMapEntry color="#cfe1e5" label="Permanent Snow and Ice" quantity="220" opacity="1" /> + <ColorMapEntry color="#ccc8b8" label="Bare" quantity="200" opacity="1" /> + <ColorMapEntry color="#ccc8b8" label="Bare" quantity="201" opacity="1" /> + <ColorMapEntry color="#ccc8b8" label="Bare" quantity="202" opacity="1" /> + <ColorMapEntry color="#4575b4" label="No data" quantity="0" opacity="0" /> + <ColorMapEntry color="#ed985f" label="Agriculture" quantity="10" opacity="1" /> + <ColorMapEntry color="#ed985f" label="Agriculture" quantity="11" opacity="1" /> + <ColorMapEntry color="#ed985f" label="Agriculture" quantity="12" opacity="1" /> + <ColorMapEntry color="#ed985f" label="Agriculture" quantity="30" opacity="1" /> + <ColorMapEntry color="#ed985f" label="Agriculture" quantity="40" opacity="1" /> + <ColorMapEntry color="#ed985f" label="Agriculture" quantity="41" opacity="1" /> + <ColorMapEntry color="#f7330c" label="Settlements" quantity="190" opacity="1" /> + <ColorMapEntry color="#75aaff" quantity="210" opacity="0" /> + </ColorMap> </RasterSymbolizer>',
        'styleType': 'sld',
        'tiles': ['https://d123t7ufog14bq.cloudfront.net/services/api/v1/tiles/0a3a5d27-3c73-4009-9252-24b113a034e8/{z}/{x}/{y}'],
        'type': 'raster',
      },
      'legendConfig': {
        'items': [
          {
            'color': '#356122',
            'name': 'Forest'
          },
          {
            'color': '#6f823b',
            'name': 'Shrubland'
          },
          {
            'color': '#b2b881',
            'name': 'Sparse vegetation'
          },
          {
            'color': '#9da321',
            'name': 'Grassland'
          },
          {
            'color': '#3da096',
            'name': 'Wetland'
          },
          {
            'color': '#cfe1e5',
            'name': 'Permanent Snow and Ice'
          },
          {
            'color': '#ccc8b8',
            'name': 'Bare'
          },
          {
            'color': '#ed985f',
            'name': 'Agriculture'
          },
          {
            'color': '#f7330c',
            'name': 'Settlements'
          }
        ],
        'type': 'basic'
      },
      'interactionConfig': {
        'type': '',
        'config': {
          'url': ''
        },
        'output': [
          {
            'column': '',
            'property': '',
            'type': '',
            'format': ''
          }
        ]
      },
      'applicationConfig': {},
      'staticImageConfig': {}
    },
    'organization': 'UNBL',
    'published': true,
    'createdAt': '2020-06-25T18:42:27.448Z',
    'updatedAt': '2020-06-29T16:30:22.974Z',
    'version': 5,
    'references': []

  },
  {

    'id': 'fcde4862-1f92-4e2c-8ca0-a5825e5575b7',
    'slug': 'internationally-important-wetlands',
    'name': 'Internationally Important Wetlands',
    'type': 'vector',
    'category': [
      'Protected Areas'
    ],
    'config': {
      'source': {
        type: 'vector',
        provider: {
          type: 'carto',
          'account': 'wri-rw',
          'layers': [
            {
              'type': 'cartodb',
              'options': {
                'sql': 'SELECT * FROM for_014_internationally_important_wetlands',
                'cartocss': '#for_014_internationally_important_wetlands { marker-width: 4; marker-opacity: 1;marker-allow-overlap: true;marker-line-width: 0.3; marker-line-color: #FFF; marker-line-opacity: 0.75; [zoom > 0] {marker-width: 4;}[zoom > 5] {marker-width: 7;} [zoom > 7] {marker-width: 12;} [zoom > 9] {marker-width: 15;} [wetland_type_general = \'Human-made wetlands\']{ marker-fill: #d95f02;} [wetland_type_general = \'Inland wetlands\']{ marker-fill: #1b9e77;} [wetland_type_general = \'Marine or coastal wetlands\']{ marker-fill: #7570b3;}[wetland_type_general = \'Other\']{ marker-fill: #4F4F4F;}}',
                'cartocss_version': '2.3.0'
              }
            }
          ],
        },
      },
      render: {
        'layers': [
          {
            'paint': {
              'circle-radius': [
                'interpolate',
                [
                  'linear'
                ],
                [
                  'zoom'
                ],
                5,
                7,
                7,
                12,
                9,
                15
              ],
              'circle-stroke-width': 0.3,
              'circle-stroke-color': ' #FFF',
              'circle-stroke-opacity': 0.75,
              'circle-color': [
                'match',
                [
                  'get',
                  'wetland_type_general'
                ],
                'Human-made wetlands',
                '#d95f02',
                'Inland wetlands',
                '#1b9e77',
                'Marine or coastal wetlands',
                '#7570b3',
                'Other',
                '#4F4F4F',
                '#4F4F4F'
              ]
            },
            'source-layer': 'layer0',
            'type': 'circle'
          }
        ],
      },
      'legendConfig': {
        'type': 'basic',
        'items': [
          {
            'name': 'Human-made wetlands',
            'color': '#d95f02',
            'id': 0
          },
          {
            'name': 'Inland wetlands',
            'color': '#1b9e77',
            'id': 1
          },
          {
            'name': 'Marine or coastal wetlands',
            'color': '#7570b3',
            'id': 2
          },
          {
            'name': 'Other',
            'color': '#4F4F4F',
            'id': 3
          }
        ]
      },
      'interactionConfig': {
        'output': [
          {
            'column': 'site_name',
            'format': null,
            'prefix': '',
            'property': 'Site Name',
            'suffix': '',
            'type': 'string'
          },
          {
            'column': 'country',
            'format': null,
            'prefix': '',
            'property': 'Country',
            'suffix': '',
            'type': 'string'
          },
          {
            'column': 'area_ha',
            'format': null,
            'prefix': '',
            'property': 'Area',
            'suffix': ' hectares',
            'type': 'number'
          }
        ]
      },
      'applicationConfig': {}
    },
    'organization': 'UNBL',
    'published': true,
    'createdAt': '2020-06-26T10:16:25.907Z',
    'updatedAt': '2020-06-26T10:16:25.907Z',
    'version': 0,
    'references': []

  },
  {

    'id': 'c4200dea-a4ff-4d46-8246-3cbf0ad188ed',
    'slug': 'intact-forest-landscapes',
    'name': 'Intact Forest Landscapes',
    'type': 'vector',
    'provider': 'cartodb',
    'category': [
      'Protected Areas'
    ],
    'config': {
      'source': {
        type: 'vector',
        'maxzoom': 18,
        provider: {
          type: 'carto',
          'account': 'wri-01',
          'layers': [
            {
              'options': {
                'cartocss_version': '2.3.0',
                'cartocss': '#intact_forest_landscapes {polygon-opacity: 0.7;polygon-fill: #136400;line-width: 0;line-opacity: 1;}#intact_forest_landscapes[class_name=\'IFL change 2000-2013\'] { polygon-fill:  rgb(152, 155, 5);}',
                'sql': 'SELECT * FROM intact_forest_landscapes'
              },
              'type': 'mapnik'
            }
          ],
          'pulseConfig': {
            'urlTemplate': 'https://{{account}}.carto.com/api/v1/map/static/bbox/{{token_groupid}}/{{bbox}}/{{width}}/{{height}}.{{format}}',
            'sql': 'SELECT st_transform(the_geom_webmercator,32663) as the_geom_webmercator, class_name FROM intact_forest_landscapes',
            'values': {
              'height': 1024,
              'width': 2048,
              'bbox': [
                -110,
                -65,
                110,
                65
              ],
              'format': 'png'
            },
            'type': 'imageOverlay'
          },
        },
      },
      render: {
        'layers': [
          {
            'paint': {
              'line-width': 0,
              'line-opacity': 1
            },
            'source-layer': 'layer0',
            'type': 'line',
            'filter': [
              'all'
            ]
          },
          {
            'paint': {
              'fill-opacity': 0.7,
              'fill-color': ' #136400'
            },
            'source-layer': 'layer0',
            'type': 'fill',
            'filter': [
              'all'
            ]
          },
          {
            'paint': {
              'fill-color': '  rgb(152, 155, 5)'
            },
            'source-layer': 'layer0',
            'type': 'fill',
            'filter': [
              'all',
              [
                '==',
                'class_name',
                'IFL change 2000-2013'
              ]
            ]
          }
        ]
      },
      'legendConfig': {
        'type': 'basic',
        'items': [
          {
            'name': 'Intact Forest Landscapes',
            'color': '#136400',
            'id': 0
          },
          {
            'name': 'IFL change 2000-2013',
            'color': 'rgb(152, 155, 5)',
            'id': 1
          }
        ]
      },
      'interactionConfig': {
        'output': [
          {
            'format': null,
            'type': 'string',
            'property': 'Class Name',
            'column': 'class_name'
          },
          {
            'format': null,
            'type': 'string',
            'property': 'IFL ID',
            'column': 'ifl_id'
          },
          {
            'format': null,
            'type': 'string',
            'property': 'IFL13 ID',
            'column': 'ifl13_id'
          },
          {
            'column': 'cartodb_id',
            'format': null,
            'prefix': '',
            'property': 'Area ID',
            'suffix': '',
            'type': 'number'
          }
        ],
        'config': {
          'url': 'https://api.resourcewatch.org/v1/query/71b81fe0-23fc-4154-8601-ba987381594c?sql=SELECT class_name, ifl_id, ifl13_id FROM intact_forest_landscapes WHERE st_intersects(the_geom,st_buffer(ST_SetSRID(st_geomfromgeojson(\'{"type":"Point","coordinates":{{point}}}\'),4326),1))'
        },
        'type': 'gridjson'
      },
      'applicationConfig': {
        'config one': {
          'type': 'lorem',
          'from': {
            'data': 'table'
          }
        }
      }
    },
    'organization': 'UNBL',
    'published': true,
    'createdAt': '2020-06-26T10:09:24.116Z',
    'updatedAt': '2020-06-26T10:09:24.116Z',
    'version': 0,
    'references': []

  },
  {

    'id': '78a7d785-2f82-4c96-9f98-13d9c8f50f73',
    'slug': 'human-footprint',
    'name': 'Human Footprint 2009,1993',
    'description': '<p>The global terrestrial Human Footprint map created by Venter et al. (2016) compiles remotely-sensed and bottom-up survey information to measure the direct and indirect human pressures altering the natural state of the environment globally. The Human Footprint map shown here indicates human pressure scores ranging from 0 - 50, representing five classes of human pressure, each encompassing an equal proportion (~20%) of the planet:</p><ul><li>0 = No Pressure</li><li>1 - 2 = Low Pressure</li><li>3 - 5 = Moderate Pressure</li><li>6 - 11 = High Pressure</li><li>12 - 50 = Very High Pressure</li></ul><p>The Human Footprint includes pressure data for:</p><ol><li>built environments,</li><li>population density,</li><li>electric infrastructure,</li><li>crop lands,</li><li>pasture lands,</li><li>roads,</li><li>railways, and</li><li>navigable waterways.</li></ol><p>These data were weighted according to estimates of their relative levels of human pressure and then summed together to create the standardized human footprint for all non-Antarctic land areas at 1 km resolution.</p><h4>LEARN MORE</h4><p><a href="https://www.nature.com/articles/sdata201667">Read the paper.</a></p><p><a href="https://datadryad.org/resource/doi:10.5061/dryad.052q5">Download the data.</a></p><h4>SOURCE(S)</h4><ul><li>University of Northern British Columbia (UNBC)</li><li>Wildlife Conservation Society (WCS)</li><li>Swiss Federal Institute of Technology in Zurich (ETH Zurich)</li><li>University of Queensland (UQ)</li><li>James Cook University (JCU)</li><li>City University of New York (CUNY)</li><li>Columbia University Earth Institute Center for International Earth</li><li>Science Information Network (CIESIN)</li></ul><h4>SUGGESTED CITATION</h4><p>(From the articles):</p><p>Venter, O. et al. Global terrestrial Human Footprint maps for 1993 and 2009. Sci. Data 3:160067 doi: 10.1038/sdata.2016.67 (2016).</p><p>Venter, O. et al. Sixteen years of change in the global terrestrial human footprint and implications for biodiversity conservation. Nat. Commun. 7:12558 doi: 10.1038/ncomms12558 (2016).</p><h4>LICENSE</h4><p><a href="https://creativecommons.org/publicdomain/zero/1.0/">Public Domain</a></p>',
    'type': 'raster',
    'provider': 'gee',
    'category': [
      'Human Impact'
    ],
    'config': {
      'source': {
        'format': 'image/png',
        'type': 'raster',
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
        'global': true,
        'metadata': 'human-footprint'
      },
      'staticImageConfig': {}
    },
    'organization': 'UNBL',
    'published': true,
    'createdAt': '2020-06-25T17:49:52.315Z',
    'updatedAt': '2020-06-26T22:01:32.559Z',
    'version': 4,
    'references': [
      {
        'category': [
          'Human Impact'
        ],
        'published': true,
        'version': 2,
        'references': [],
        'description': '',
        'name': 'Human Footprint 2009',
        'slug': 'human-footprint-2009',
        'type': 'raster',
        'provider': 'gee',
        'config': {
          'source': {
            'assetId': 'projects/earthpulse-sandbox/assets/layers/human_footprint_2009',
            'type': 'raster',
            'sldValue': '<RasterSymbolizer> <ColorMap type="ramp" extended="true"> <ColorMapEntry color="#ECE5F4" label="0" quantity="0" /> + <ColorMapEntry color="#D5BBDB" quantity="10" /> + <ColorMapEntry color="#D47DBC" quantity="20" /> + <ColorMapEntry color="#E62C90" quantity="30" /> + <ColorMapEntry color="#BF0650" quantity="40" /> + <ColorMapEntry color="#780126" label="50" quantity="50" /> + </ColorMap> </RasterSymbolizer>',
            'styleType': 'sld',
            'tiles': ['https://d123t7ufog14bq.cloudfront.net/services/api/v1/tiles/d6f8fbf9-04f4-4f48-9415-9f6212223275/{z}/{x}/{y}'],

          },
          'legendConfig': {
            'items': [
              {
                'color': '#ECE5F4',
                'value': '0'
              },
              {
                'color': '#D5BBDB',
                'value': ''
              },
              {
                'color': '#D47DBC',
                'value': ''
              },
              {
                'color': '#E62C90',
                'value': ''
              },
              {
                'color': '#BF0650',
                'value': ''
              },
              {
                'color': '#780126',
                'value': '50'
              }
            ],
            'type': 'gradient'
          },
          'interactionConfig': {
            'type': '',
            'config': {
              'url': ''
            },
            'output': [
              {
                'column': '',
                'property': '',
                'type': '',
                'format': ''
              }
            ]
          },
          'applicationConfig': {},
          'staticImageConfig': {}
        },
        'organization': 'UNBL',
        'createdAt': '2020-06-25T17:52:33.605Z',
        'updatedAt': '2020-06-26T22:33:52.477Z',
        'id': 'd6f8fbf9-04f4-4f48-9415-9f6212223275'
      },
      {
        'category': [
          'Human Impact'
        ],
        'published': true,
        'version': 2,
        'references': [],
        'name': 'Human Footprint 1993',
        'slug': 'human-footprint-1993',
        'type': 'raster',
        'provider': 'gee',
        'config': {
          'source': {
            'assetId': 'projects/earthpulse-sandbox/assets/layers/human_footprint_1993',
            'sldValue': '<RasterSymbolizer> <ColorMap type="ramp" extended="true"> <ColorMapEntry color="#ECE5F4" label="0" quantity="0" /> + <ColorMapEntry color="#D5BBDB" quantity="10" /> + <ColorMapEntry color="#D47DBC" quantity="20" /> + <ColorMapEntry color="#E62C90" quantity="30" /> + <ColorMapEntry color="#BF0650" quantity="40" /> + <ColorMapEntry color="#780126" label="50" quantity="50" /> + </ColorMap> </RasterSymbolizer>',
            'styleType': 'sld',
            'tiles': ['https://d123t7ufog14bq.cloudfront.net/services/api/v1/tiles/66481e5a-a611-4684-beee-419944b4d883/{z}/{x}/{y}'],
            'type': 'raster',
          },
          'legendConfig': {
            'items': [
              {
                'color': '#ECE5F4',
                'value': '0'
              },
              {
                'color': '#D5BBDB',
                'value': ''
              },
              {
                'color': '#D47DBC',
                'value': ''
              },
              {
                'color': '#E62C90',
                'value': ''
              },
              {
                'color': '#BF0650',
                'value': ''
              },
              {
                'color': '#780126',
                'value': '50'
              }
            ],
            'type': 'gradient'
          },
          'interactionConfig': {
            'type': '',
            'config': {
              'url': ''
            },
            'output': [
              {
                'column': '',
                'property': '',
                'type': '',
                'format': ''
              }
            ]
          },
          'applicationConfig': {},
          'staticImageConfig': {}
        },
        'organization': 'UNBL',
        'createdAt': '2020-06-25T17:51:26.521Z',
        'updatedAt': '2020-06-26T22:33:40.093Z',
        'id': '66481e5a-a611-4684-beee-419944b4d883'
      }
    ]

  },
  {

    'id': 'ff23dc9c-80fd-4b67-8c9e-930e10f268a9',
    'slug': 'human-development-index',
    'name': 'Human Development Index 2015',
    'description': '<p>The Human Development Index (HDI), created by the United Nations Development Programme, is a summary measure of average achievement in key dimensions of human development:</p><ul><li>A long and healthy life: assessed by life expectancy at birth</li><li>Education: measured by mean of years of schooling for adults aged 25 years and more and expected years of schooling for children of school entering age</li><li>A decent standard of living: measured by gross national income per capita</li></ul><p>The HDI is the geometric mean of normalized indices for each of the three dimensions.</p><p>The cutoff points for HDI categories are:</p><ul><li>Less than 0.550 = low human development,</li><li>0.550\\\\u20130.699 = medium human development</li><li>0.700\\\\u20130.799 = high human development</li><li>0.800 or greater = very high human development.</li></ul><p>Learn More</p><p><a href="http://hdr.undp.org/en/content/human-development-index-hdi">United Nations Development Programme Read about HDI and download the data</a></p><p>Source(s)</p><p>United Nations Development Programme (UNDP)</p><p>&nbsp;</p><p>Suggested Citation</p><p>United Nations Development Programme, Human Development Report. 1980-2015. \'Human Development Index.\' Retrieved from http://hdr.undp.org/en/composite/HDI.</p><p>License</p><p><a href="https://creativecommons.org/licenses/by/3.0/igo/">Creative Commons Attribution 3.0 IGO</a></p>',
    'type': 'raster',
    'provider': 'gee',
    'category': [
      'Human Impact'
    ],
    'config': {
      'source': {
        'assetId': 'projects/earthpulse-sandbox/assets/layers/human_development_index_2015',
        'sldValue': '<RasterSymbolizer> <ColorMap type="ramp" extended="false"> <ColorMapEntry color="#ECE5F4" label="0" quantity="0" /> + <ColorMapEntry color="#D5BBDB" label="0.20" quantity="0.20" /> + <ColorMapEntry color="#D47DBC" label="0.40" quantity="0.40" /> + <ColorMapEntry color="#E62C90" label="0.60" quantity="0.60" /> + <ColorMapEntry color="#BF0650" label="0.80" quantity="0.80" /> + <ColorMapEntry color="#780126" label="1" quantity="1" /> + </ColorMap> </RasterSymbolizer>',
        'styleType': 'sld',
        'tiles': ['https://d123t7ufog14bq.cloudfront.net/services/api/v1/tiles/ff23dc9c-80fd-4b67-8c9e-930e10f268a9/{z}/{x}/{y}'],
        type: 'raster',
      },
      'legendConfig': {
        'items': [
          {
            'color': '#ECE5F4',
            'value': '0'
          },
          {
            'color': '#D5BBDB',
            'value': ''
          },
          {
            'color': '#D47DBC',
            'value': ''
          },
          {
            'color': '#E62C90',
            'value': ''
          },
          {
            'color': '#BF0650',
            'value': ''
          },
          {
            'color': '#780126',
            'value': '1'
          }
        ],
        'type': 'gradient'
      },
      'interactionConfig': {
        'type': '',
        'config': {
          'url': ''
        },
        'output': [
          {
            'column': '',
            'property': '',
            'type': '',
            'format': ''
          }
        ]
      },
      'applicationConfig': {},
      'staticImageConfig': {}
    },
    'organization': 'UNBL',
    'published': true,
    'createdAt': '2020-06-25T17:45:04.724Z',
    'updatedAt': '2020-06-25T18:46:25.498Z',
    'version': 2,
    'references': []

  },
  {

    'id': '034f3529-2dc7-4a88-a604-613b5fdf09cf',
    'slug': 'gridded-livestock-sheep',
    'name': 'Gridded Livestock of the World - Sheep 2010',
    'type': 'raster',
    'provider': 'gee',
    'category': [
      'Human Impact'
    ],
    'config': {
      'source': {
        'assetId': 'projects/earthpulse-sandbox/assets/layers/gridded_livestock_sheep_2010',
        'maxNativeZoom': 13,
        'maxzoom': 19,
        'minNativeZoom': 4,
        'minzoom': 2,
        'sldValue': '<RasterSymbolizer><ColorMap type="ramp" extended="false" ><ColorMapEntry color="#ffffcc" quantity="0" opacity="1" label="0"/><ColorMapEntry color="#f8f8bf" quantity="10" opacity="1" label="10"/><ColorMapEntry color="#f1f194" quantity="100" opacity="1" label="100"/><ColorMapEntry color="#ffeda0" quantity="1000" opacity="1" label="1000" /><ColorMapEntry color="#feb24c" quantity="10000" opacity="1" label="10000" /><ColorMapEntry color="#ed4827" quantity="100000" opacity="1" label="100000" /></ColorMap></RasterSymbolizer>',
        'styleType': 'sld',
        'tiles': ['https://d123t7ufog14bq.cloudfront.net/services/api/v1/tiles/034f3529-2dc7-4a88-a604-613b5fdf09cf/{z}/{x}/{y}'],
        'params_config': [],
        'type': 'raster'
      },
      'legendConfig': {
        'items': [
          {
            'color': '#ffffcc',
            'value': '0'
          },
          {
            'color': '#f8f8bf',
            'value': '10'
          },
          {
            'color': '#f1f194',
            'value': '100'
          },
          {
            'color': '#ffeda0',
            'value': '1000'
          },
          {
            'color': '#feb24c',
            'value': '10000'
          },
          {
            'color': '#ed4827',
            'value': '100000'
          }
        ],
        'type': 'gradient'
      },
      'interactionConfig': {},
      'applicationConfig': {
        'active': true,
        'default': true,
        'global': true,
        'metadata': 'livestock'
      },
      'staticImageConfig': {}
    },
    'organization': 'UNBL',
    'published': true,
    'createdAt': '2020-06-26T21:59:03.410Z',
    'updatedAt': '2020-06-26T21:59:23.060Z',
    'version': 1,
    'references': []
  },
  {

    'id': 'e5571c3c-f252-4084-baf9-6b0521ba96f5',
    'slug': 'gridded-livestock-goats',
    'name': 'Gridded Livestock of the World - Goats 2010',
    'type': 'raster',
    'provider': 'gee',
    'category': [
      'Human Impact'
    ],
    'config': {
      'source': {
        'assetId': 'projects/earthpulse-sandbox/assets/layers/gridded_livestock_goats_2010',
        'maxNativeZoom': 13,
        'maxzoom': 19,
        'minNativeZoom': 4,
        'minzoom': 2,
        'sldValue': '<RasterSymbolizer><ColorMap type="ramp" extended="false" ><ColorMapEntry color="#ffffcc" quantity="0" opacity="1" label="0"/><ColorMapEntry color="#f8f8bf" quantity="10" opacity="1" label="10"/><ColorMapEntry color="#f1f194" quantity="100" opacity="1" label="100"/><ColorMapEntry color="#ffeda0" quantity="1000" opacity="1" label="1000" /><ColorMapEntry color="#feb24c" quantity="10000" opacity="1" label="10000" /><ColorMapEntry color="#ed4827" quantity="100000" opacity="1" label="100000" /></ColorMap></RasterSymbolizer>',
        'styleType': 'sld',
        'tiles': ['https://d123t7ufog14bq.cloudfront.net/services/api/v1/tiles/e5571c3c-f252-4084-baf9-6b0521ba96f5/{z}/{x}/{y}'],
        'params_config': [],
        'type': 'raster'
      },
      'legendConfig': {
        'items': [
          {
            'color': '#ffffcc',
            'value': '0'
          },
          {
            'color': '#f8f8bf',
            'value': '10'
          },
          {
            'color': '#f1f194',
            'value': '100'
          },
          {
            'color': '#ffeda0',
            'value': '1000'
          },
          {
            'color': '#feb24c',
            'value': '10000'
          },
          {
            'color': '#ed4827',
            'value': '100000'
          }
        ],
        'type': 'gradient'
      },
      'interactionConfig': {},
      'applicationConfig': {
        'active': true,
        'default': true,
        'global': true,
        'metadata': 'livestock'
      },
      'staticImageConfig': {}
    },
    'organization': 'UNBL',
    'published': true,
    'createdAt': '2020-06-26T21:53:39.841Z',
    'updatedAt': '2020-06-26T21:53:59.689Z',
    'version': 1,
    'references': []

  },
  {

    'id': 'ce02e5d6-035e-433d-a09b-00d6629e403a',
    'slug': 'gridded-livestock-chickens',
    'name': 'Gridded Livestock of the World - Chickens 2010',
    'type': 'raster',
    'provider': 'gee',
    'category': [
      'Human Impact'
    ],
    'config': {
      'source': {
        'assetId': 'projects/earthpulse-sandbox/assets/layers/gridded_livestock_chickens_2010',
        'maxNativeZoom': 13,
        'maxzoom': 19,
        'minNativeZoom': 4,
        'minzoom': 2,
        'sldValue': '<RasterSymbolizer><ColorMap type="ramp" extended="false" ><ColorMapEntry color="#ffffcc" quantity="0" opacity="1" label="0"/><ColorMapEntry color="#f8f8bf" quantity="10" opacity="1" label="10"/><ColorMapEntry color="#f1f194" quantity="100" opacity="1" label="100"/><ColorMapEntry color="#ffeda0" quantity="1000" opacity="1" label="1000" /><ColorMapEntry color="#feb24c" quantity="10000" opacity="1" label="10000" /><ColorMapEntry color="#ed4827" quantity="100000" opacity="1" label="100000" /><ColorMapEntry color="#870021" quantity="1000000" label="1000000" /></ColorMap></RasterSymbolizer>',
        'styleType': 'sld',
        'tiles': ['https://d123t7ufog14bq.cloudfront.net/services/api/v1/tiles/ce02e5d6-035e-433d-a09b-00d6629e403a/{z}/{x}/{y}'],
        'params_config': [],
        'type': 'raster'
      },
      'legendConfig': {
        'items': [
          {
            'color': '#ffffcc',
            'value': '0'
          },
          {
            'color': '#f8f8bf',
            'value': '10'
          },
          {
            'color': '#f1f194',
            'value': '100'
          },
          {
            'color': '#ffeda0',
            'value': '1000'
          },
          {
            'color': '#feb24c',
            'value': '10000'
          },
          {
            'color': '#ed4827',
            'value': '100000'
          },
          {
            'color': '#870021',
            'value': '1000000'
          }
        ],
        'type': 'gradient'
      },
      'interactionConfig': {},
      'applicationConfig': {
        'active': true,
        'default': true,
        'global': true,
        'metadata': 'livestock'
      },
      'staticImageConfig': {}
    },
    'organization': 'UNBL',
    'published': true,
    'createdAt': '2020-06-26T21:38:28.057Z',
    'updatedAt': '2020-06-29T06:50:48.925Z',
    'version': 2,
    'references': []
  },
  {
    'id': 'fe60548e-a2ba-4b4e-9b21-37383880f532',
    'slug': 'gridded-livestock-cattle',
    'name': 'Gridded Livestock of the World - Cattle 2010',
    'type': 'raster',
    'provider': 'gee',
    'category': [
      'Human Impact'
    ],
    'config': {
      'source': {
        'assetId': 'projects/earthpulse-sandbox/assets/layers/gridded_livestock_cattle_2010',
        'maxNativeZoom': 13,
        'maxzoom': 19,
        'minNativeZoom': 4,
        'minzoom': 2,
        'sldValue': '<RasterSymbolizer><ColorMap type="ramp" extended="false" ><ColorMapEntry color="#ffffcc" quantity="0" opacity="1" label="0"/><ColorMapEntry color="#f8f8bf" quantity="10" opacity="1" label="10"/><ColorMapEntry color="#f1f194" quantity="100" opacity="1" label="100"/><ColorMapEntry color="#ffeda0" quantity="1000" opacity="1" label="1000" /><ColorMapEntry color="#feb24c" quantity="10000" opacity="1" label="10000" /><ColorMapEntry color="#ed4827" quantity="100000" opacity="1" label="100000" /></ColorMap></RasterSymbolizer>',
        'styleType': 'sld',
        'tiles': ['https://d123t7ufog14bq.cloudfront.net/services/api/v1/tiles/fe60548e-a2ba-4b4e-9b21-37383880f532/{z}/{x}/{y}'],
        'params_config': [],
        'type': 'raster'
      },
      'legendConfig': {
        'items': [
          {
            'color': '#ffffcc',
            'value': '0'
          },
          {
            'color': '#f8f8bf',
            'value': '10'
          },
          {
            'color': '#f1f194',
            'value': '100'
          },
          {
            'color': '#ffeda0',
            'value': '1000'
          },
          {
            'color': '#feb24c',
            'value': '10000'
          },
          {
            'color': '#ed4827',
            'value': '100000'
          }
        ],
        'type': 'gradient'
      },
      'interactionConfig': {},
      'applicationConfig': {
        'active': true,
        'default': true,
        'global': true,
        'metadata': 'livestock'
      },
      'staticImageConfig': {}
    },
    'organization': 'UNBL',
    'published': true,
    'createdAt': '2020-06-26T21:29:50.776Z',
    'updatedAt': '2020-06-29T06:50:07.333Z',
    'version': 2,
    'references': []

  },
  {
    'id': '936f76e2-78f0-4c45-a6d2-6c27679d695a',
    'slug': 'prob-urban-expansion-2030',
    'name': 'Global Grid of Probabilities of Urban Expansion to 2030',
    'type': 'raster',
    'provider': 'gee',
    'category': [
      'Human Impact'
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
        'tiles': ['https://api.resourcewatch.org/v1/layer/822bf5bb-f521-410b-aa29-ccfbd64b20a7/tile/gee/{z}/{x}/{y}'],
        'params_config': [],
        'type': 'raster'
      },
      'legendConfig': {
        'items': [
          {
            'color': '#fef0d9',
            'name': '20%'
          },
          {
            'color': '#fdbb84',
            'name': '40%'
          },
          {
            'color': '#fc8d59',
            'name': '60%'
          },
          {
            'color': '#e34a33',
            'name': '80%'
          },
          {
            'color': '#b30000',
            'name': '100%'
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
    'createdAt': '2020-06-26T20:48:54.293Z',
    'updatedAt': '2020-06-30T19:49:04.785Z',
    'version': 6,
    'references': []

  },
  {

    'id': '6de2daab-9e41-4360-a6cc-a280ed05a542',
    'slug': 'ecoregion-by-biome',
    'name': 'Ecoregion by Biome',
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
          'account': 'wri-rw',
          'layers': [
            {
              'type': 'mapnik',
              'options': {
                'sql': 'SELECT * From bio_042_ecoregions_by_biome_1_14',
                'cartocss': '#layer {polygon-opacity: 1; line-width: 0.5; line-color: #FFF; line-opacity: 0; } [biome_name =\'Boreal Forests/Taiga\']{polygon-fill:#7AB6F5;} [biome_name =\'Deserts & Xeric Shrublands\']{polygon-fill:#CC6767;} [biome_name=\'Flooded Grasslands & Savannas\']{polygon-fill:#BEE7FF ;} [biome_name=\'Mangroves\']{polygon-fill:#FE01C4 ;} [biome_name=\'Mediterranean Forests, Woodlands & Scrub\'] {polygon-fill:#FE0000 ;} [biome_name=\'Montane Grasslands & Shrublands\']{polygon-fill:#D6C39D ;} [biome_name=\'Rock and Ice\']{polygon-fill:#FFEAAF ;} [biome_name=\'Temperate Broadleaf & Mixed Forests\']{polygon-fill:#00734C ;} [biome_name=\'Temperate Conifer Forests\']{polygon-fill:#458970 ;} [biome_name=\'Temperate Grasslands, Savannas & Shrublands\']{polygon-fill:#FEFF73 ;} [biome_name=\'Tropical & Subtropical Coniferous Forests\']{polygon-fill:#88CE66;} [biome_name=\'Tropical & Subtropical Dry Broadleaf Forests\']{polygon-fill:#CCCD65 ;} [biome_name=\'Tropical & Subtropical Grasslands, Savannas & Shrublands\']{polygon-fill:#FEAA01 ;} [biome_name=\'Tropical & Subtropical Moist Broadleaf Forests\']{polygon-fill:#38A700 ;} [biome_name=\'Tundra\']{polygon-fill:#9ED7C2 ;}',
                'cartocss_version': '2.3.0'
              }
            }
          ],
        },
        'layerType': 'vector'
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
              'fill-color': '#7AB6F5'
            },
            'source-layer': 'layer0',
            'type': 'fill',
            'filter': [
              'all',
              [
                '==',
                'biome_name',
                'Boreal Forests/Taiga'
              ]
            ]
          },
          {
            'paint': {
              'fill-color': '#CC6767'
            },
            'source-layer': 'layer0',
            'type': 'fill',
            'filter': [
              'all',
              [
                '==',
                'biome_name',
                'Deserts & Xeric Shrublands'
              ]
            ]
          },
          {
            'paint': {
              'fill-color': '#BEE7FF '
            },
            'source-layer': 'layer0',
            'type': 'fill',
            'filter': [
              'all',
              [
                '==',
                'biome_name',
                'Flooded Grasslands & Savannas'
              ]
            ]
          },
          {
            'paint': {
              'fill-color': '#FE01C4 '
            },
            'source-layer': 'layer0',
            'type': 'fill',
            'filter': [
              'all',
              [
                '==',
                'biome_name',
                'Mangroves'
              ]
            ]
          },
          {
            'paint': {
              'fill-color': '#FE0000 '
            },
            'source-layer': 'layer0',
            'type': 'fill',
            'filter': [
              'all',
              [
                '==',
                'biome_name',
                'Mediterranean Forests, Woodlands & Scrub'
              ]
            ]
          },
          {
            'paint': {
              'fill-color': '#D6C39D '
            },
            'source-layer': 'layer0',
            'type': 'fill',
            'filter': [
              'all',
              [
                '==',
                'biome_name',
                'Montane Grasslands & Shrublands'
              ]
            ]
          },
          {
            'paint': {
              'fill-color': '#FFEAAF '
            },
            'source-layer': 'layer0',
            'type': 'fill',
            'filter': [
              'all',
              [
                '==',
                'biome_name',
                'Rock and Ice'
              ]
            ]
          },
          {
            'paint': {
              'fill-color': '#00734C '
            },
            'source-layer': 'layer0',
            'type': 'fill',
            'filter': [
              'all',
              [
                '==',
                'biome_name',
                'Temperate Broadleaf & Mixed Forests'
              ]
            ]
          },
          {
            'paint': {
              'fill-color': '#458970 '
            },
            'source-layer': 'layer0',
            'type': 'fill',
            'filter': [
              'all',
              [
                '==',
                'biome_name',
                'Temperate Conifer Forests'
              ]
            ]
          },
          {
            'paint': {
              'fill-color': '#FEFF73 '
            },
            'source-layer': 'layer0',
            'type': 'fill',
            'filter': [
              'all',
              [
                '==',
                'biome_name',
                'Temperate Grasslands, Savannas & Shrublands'
              ]
            ]
          },
          {
            'paint': {
              'fill-color': '#88CE66'
            },
            'source-layer': 'layer0',
            'type': 'fill',
            'filter': [
              'all',
              [
                '==',
                'biome_name',
                'Tropical & Subtropical Coniferous Forests'
              ]
            ]
          },
          {
            'paint': {
              'fill-color': '#CCCD65 '
            },
            'source-layer': 'layer0',
            'type': 'fill',
            'filter': [
              'all',
              [
                '==',
                'biome_name',
                'Tropical & Subtropical Dry Broadleaf Forests'
              ]
            ]
          },
          {
            'paint': {
              'fill-color': '#FEAA01 '
            },
            'source-layer': 'layer0',
            'type': 'fill',
            'filter': [
              'all',
              [
                '==',
                'biome_name',
                'Tropical & Subtropical Grasslands, Savannas & Shrublands'
              ]
            ]
          },
          {
            'paint': {
              'fill-color': '#38A700 '
            },
            'source-layer': 'layer0',
            'type': 'fill',
            'filter': [
              'all',
              [
                '==',
                'biome_name',
                'Tropical & Subtropical Moist Broadleaf Forests'
              ]
            ]
          },
          {
            'paint': {
              'fill-color': '#9ED7C2 '
            },
            'source-layer': 'layer0',
            'type': 'fill',
            'filter': [
              'all',
              [
                '==',
                'biome_name',
                'Tundra'
              ]
            ]
          },
          {
            'paint': {
              'line-width': 0.5,
              'line-color': ' #525252',
              'line-opacity': 0.5
            },
            'source-layer': 'layer0',
            'type': 'line',
            'filter': [
              'all'
            ]
          }
        ]
      },
      'legendConfig': {
        'items': [
          {
            'color': '#7AB6F5',
            'name': 'Boreal Forests/Taiga',
            'id': 0
          },
          {
            'color': '#CC6767',
            'name': 'Deserts & Xeric Shrublands',
            'id': 1
          },
          {
            'color': '#BEE7FF',
            'name': 'Flooded Grasslands & Savannas',
            'id': 2
          },
          {
            'color': '#FE01C4',
            'name': 'Mangroves',
            'id': 3
          },
          {
            'color': '#FE0000',
            'name': 'Mediterranean Forests, Woodlands & Scrub',
            'id': 4
          },
          {
            'color': '#D6C39D',
            'name': 'Montane Grasslands & Shrublands',
            'id': 5
          },
          {
            'color': '#FFEAAF',
            'name': 'Rock and Ice',
            'id': 6
          },
          {
            'color': '#00734C',
            'name': 'Temperate Broadleaf & Mixed Forests',
            'id': 7
          },
          {
            'color': '#458970',
            'name': 'Temperate Conifer Forests',
            'id': 8
          },
          {
            'color': '#FEFF73',
            'name': 'Temperate Grasslands, Savannas & Shrublands',
            'id': 9
          },
          {
            'color': '#88CE66',
            'name': 'Tropical & Subtropical Coniferous Forests',
            'id': 10
          },
          {
            'color': '#CCCD65',
            'name': 'Tropical & Subtropical Dry Broadleaf Forests',
            'id': 11
          },
          {
            'color': '#FEAA01',
            'name': 'Tropical & Subtropical Grasslands, Savannas & Shrublands',
            'id': 12
          },
          {
            'color': '#38A700',
            'name': 'Tropical & Subtropical Moist Broadleaf Forests',
            'id': 13
          },
          {
            'color': '#9ED7C2',
            'name': 'Tundra',
            'id': 14
          }
        ],
        'type': 'basic'
      },
      'interactionConfig': {
        'output': [
          {
            'type': 'string',
            'suffix': '',
            'property': 'Biome Name',
            'prefix': '',
            'format': null,
            'column': 'biome_name'
          },
          {
            'type': 'string',
            'suffix': '',
            'property': 'Ecoregion Name',
            'prefix': '',
            'format': null,
            'column': 'eco_name'
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
    'createdAt': '2020-06-26T10:02:21.181Z',
    'updatedAt': '2020-06-26T10:02:21.181Z',
    'version': 0,
    'references': []

  },
  {

    'id': '0cfe2272-615c-4e28-a91e-38c9c187059c',
    'slug': 'biodiversity-intactness',
    'name': 'Biodiversity Intactness 2015',
    'description': '<p>&nbsp;</p><p>Biodiversity intactness is the average proportion of natural biodiversity remaining in local ecosystems.</p><p>The Biodiversity Intactness Index (BII) shown here indicates the modeled average abundance for 2005 of a large, diverse set of naturally-occurring species in a terrestrial area, relative to a baseline with minimal human impacts.</p><p>A score of 100% indicates no loss in species from the baseline ecosystem to the current ecosystem.</p><p>The values are categorized from very low intactness to very high intactness based on the following thresholds</p><ul><li>Very low: 0-20%</li><li>Low: 20-40%</li><li>Medium: 40-60%</li><li>High: 60-80%</li><li>Very High: 80-100%</li></ul><p>&nbsp;</p><h5>Learn More</h5><p><a href="https://science.sciencemag.org/content/353/6296/288">Read the Paper</a>.</p><p><a href="https://data.nhm.ac.uk/dataset/global-map-of-the-biodiversity-intactness-index-from-newbold-et-al-2016-science">Download the Data.</a></p><p>Source(s)</p><p>United Nations Environment Programme World Conservation Monitoring Centre (UNEP-WCMC)</p><p>University College London (UCL)</p><p>Natural History Museum (NHM)</p><p>Imperial College London (Imperial)</p><p>Commonwealth Scientific and Industrial Research Organisation, Canberra (CSIRO)</p><p>Luc Hoffmann Institute</p><p>University of Copenhagen (UCPH)</p><p>University of Sussex (Sussex)</p><h5>Suggested Citation</h5><p>Newbold, Tim, Lawrence N. Hudson, Andrew P. Arnell, Sara Contu, et al. 2016. "Dataset: Global Map of the Biodiversity Intactness Index." From Tim Newbold et al., "Has Land Use Pushed Territorial Biodiversity beyond the Planetary Boundary? A Global Assessment," Science 353 (2016): 288-289. <a href="http://dx.doi.org/10.5519/0009936">http://dx.doi.org/10.5519/0009936</a>. Retrieved: 01 Dec 2017.&nbsp;</p><p>License</p><p><a href="https://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International</a></p><p>&nbsp;</p>',
    'type': 'raster',
    'provider': 'gee',
    'category': [
      'Biodiversity'
    ],
    'config': {
      'source': {
        'type': 'raster',
        'assetId': 'projects/earthpulse-sandbox/assets/layers/BIIAb-2015-old',
        'sldValue': '<RasterSymbolizer> <ColorMap type="ramp" extended="false"> <ColorMapEntry color="#efffd1" quantity="0.0" opacity="1" /> <ColorMapEntry color="#bad4a0" quantity="0.25" /> <ColorMapEntry color="#87ab71" quantity="0.50" /> <ColorMapEntry color="#568345" quantity="0.75" />  <ColorMapEntry color="#235c1a" quantity="1.0" /> </ColorMap> </RasterSymbolizer>',
        'styleType': 'sld',
        'tiles': ['https://d123t7ufog14bq.cloudfront.net/services/api/v1/tiles/0cfe2272-615c-4e28-a91e-38c9c187059c/{z}/{x}/{y}']

      },
      'legendConfig': {
        'items': [
          {
            'color': '#efffd1',
            'value': '0'
          },
          {
            'color': '#bad4a0'
          },
          {
            'color': '#87ab71'
          },
          {
            'color': '#568345'
          },
          {
            'color': '#235c1a',
            'value': '100'
          }
        ],
        'type': 'gradient'
      },
      'interactionConfig': {
        'type': '',
        'config': {
          'url': ''
        },
        'output': [
          {
            'column': '',
            'property': '',
            'type': '',
            'format': ''
          }
        ]
      },
      'applicationConfig': {},
      'staticImageConfig': {}
    },
    'organization': 'UNBL',
    'published': true,
    'createdAt': '2020-06-25T13:25:20.834Z',
    'updatedAt': '2020-06-30T17:30:26.856Z',
    'version': 5,
    'references': []

  },
  {
    'id': 'c3b94afd-1970-4801-8ffe-5a8a61d08e1d',
    'slug': 'aqueduct-groundwater-table-decline',
    'name': 'Aqueduct Groundwater Table Decline',
    'type': 'vector',
    'category': [
      'Protected Areas'
    ],
    'config': {
      'source': {
        type: 'vector',
        'maxzoom': 18,
        'minzoom': 0,
        provider: {
          type: 'carto',
          'account': 'wri-rw',
          'layers': [
            {
              'type': 'mapnik',
              'options': {
                'sql': 'SELECT * FROM wat_054_aqueduct_groundwater_table_decline',
                'cartocss': '#layer {polygon-opacity:1; line-width:0; line-color:#FFF; line-opacity:0;} [gtd_cat=4]{polygon-fill:#990000;}[gtd_cat=3]{polygon-fill:#FF1900;} [gtd_cat=2]{polygon-fill:#FF9900;} [gtd_cat=1]{polygon-fill:#FFE600;} [gtd_cat=0]{polygon-fill:#FFFF99;}[gtd_cat=-1]{polygon-fill:#808080;}[gtd_cat=-9999]{polygon-fill:#4E4E4E;}',
                'cartocss_version': '2.3.0'
              }
            }
          ]
        },
        'layerType': 'vector'
      },
      render: {
        'layers': [
          {
            'paint': {
              'fill-color': [
                'step',
                [
                  'to-number',
                  [
                    'get',
                    'gtd_cat'
                  ]
                ],
                '#4E4E4E',
                -1,
                '#808080',
                0,
                '#FFFF99',
                1,
                '#FFE600',
                2,
                '#FF9900',
                3,
                '#FF1900',
                4,
                '#990000'
              ],
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
              'line-width': 0.5,
              'line-color': '#888',
              'line-opacity': 0.4
            },
            'source-layer': 'layer0',
            'type': 'line',
            'filter': [
              'all'
            ]
          }
        ]
      },
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
            'name': 'Insignificant trend'
          },
          {
            'id': 5,
            'color': '#4E4E4E',
            'name': 'No data'
          }
        ],
        'type': 'basic'
      },
      'interactionConfig': {
        'output': [
          {
            'type': 'string',
            'suffix': '',
            'property': 'Groundwater table decline',
            'prefix': '',
            'format': null,
            'column': 'gtd_label'
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
    'createdAt': '2020-06-26T10:11:46.218Z',
    'updatedAt': '2020-06-30T17:53:25.608Z',
    'version': 3,
    'references': []
  },
  {

    'id': '4adc9b7b-37be-442c-b90f-18aa9abe7f76',
    'slug': 'aqueduct-baseline-water-stress',
    'name': 'Aqueduct Baseline Water Stress',
    'type': 'vector',
    'category': [
      'Protected Areas'
    ],
    'config': {
      'source': {
        'type': 'vector',
        provider: {
          type: 'carto',
          'account': 'wri-rw',
          'layers': [
            {
              'type': 'cartodb',
              'options': {
                'sql': 'SELECT * FROM wat_050_aqueduct_baseline_water_stress',
                'cartocss': '#layer {polygon-opacity:1; line-width:0.1;line-opacity:1;} [bws_cat=4]{polygon-fill:#990000; line-color:#990000}[bws_cat=3]{polygon-fill:#FF1900; line-color:#FF1900} [bws_cat=2]{polygon-fill:#FF9900; line-color:#FF9900} [bws_cat=1]{polygon-fill:#FFE600; line-color:#FFE600} [bws_cat=0]{polygon-fill:#FFFF99; line-color:#FFFF99}[bws_cat=-1]{polygon-fill:#808080; line-color:#808080}[bws_cat=-9999]{polygon-fill:#4E4E4E; line-color:#4E4E4E}',
                'cartocss_version': '2.3.0'
              }
            }
          ]

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
      },
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


    const coco = {
      ...adaptedLayer,
      references: adaptedReferences
    };
    return coco;

  }


  return {
    ...adaptedLayer,
  };
}
