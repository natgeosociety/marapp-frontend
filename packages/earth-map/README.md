# Earth Map

Marapp Earth-Map, explore data and features interactively on a map.

## Setup

Available commands:

| Command                   | Description                    |
| ------------------------- | ------------------------------ |
| yarn install              | Install dependencies.          |
| yarn start                | Start development server.      |
| yarn build                | Compile TypeScript resources.  |

## Running

Create a local `.env` and `.env.local` file based on [.env.sample](.env.sample), add the required configuration for the environment. 

The following environment variables are required by the application.

| **Key** | **Description** |
| ------------- |:----------------|
| `NODE_ENV` | Node.js environment (e.g. `development`, `production`) |
| `NODE_PATH` | https://nodejs.org/api/modules.html#modules_loading_from_the_global_folders (e.g. `src`) |
| `SASS_PATH` | https://create-react-app.dev/docs/adding-a-sass-stylesheet/ (e.g. `node_modules:src`) |
| `PUBLIC_URL` | The public URL (e.g. `/`) |
| `REACT_APP_NAME` | The name of the app (e.g. `marapp`) |
| `REACT_APP_BASE_URL` | The base URL (e.g. `/`) |
| `REACT_APP_ASSETS_URL` | The assets URL |
| `REACT_APP_API_URL` | The API URL |
| `REACT_APP_FULLPAGE_LICENSE` | https://alvarotrigo.com/fullPage/ - fullPage.js License KEY |
| `REACT_APP_MAPBOX_TOKEN` | https://docs.mapbox.com/help/glossary/access-token - Mapbox access token |
| `REACT_APP_AUTH0_DOMAIN` | https://auth0.com/docs/custom-domains - Auth0 domain |
| `REACT_APP_AUTH0_CLIENT_ID`| https://auth0.com/docs/flows/concepts/client-credentials - Auth0 Client ID |
| `REACT_APP_AUTH0_AUDIENCE` | https://auth0.com/docs/tokens/guides/get-access-tokens - Auth0 audience |
| `REACT_APP_AUTH0_NAMESPACE` | https://auth0.com/docs/tokens/guides/create-namespaced-custom-claims - Auth0 namespace |
| `REACT_APP_ADMIN_URL` | The URL for admin component (e.g. `/admin/`) |
| `REACT_APP_GTM_TAG` | Google Tag Manager ID |
| `REACT_APP_ENABLE_PUBLIC_ACCESS` | Enable unauthenticated access |

## Getting started

 - [Redux](#redux)
 - [Auth](#auth)
 - [Map](#map)
 - [Layers](#layers)
 - [Theming](#theming)

### Router

Managed by [`redux first router`](https://github.com/faceyspacey/redux-first-router).

To be able to use Redux as is while keeping the address bar in sync. To define paths as actions, and handle path params and query strings as action payloads.

The address bar and Redux actions should be bi-directionally mapped, including via the browser's back/forward buttons. Dispatch an action and the address bar updates. Change the address, and an action is dispatched.

In addition, here are some obstacles Redux-First Router seeks to avoid:

- Rendering from state that doesn't come from Redux
- Dealing with the added complexity from having state outside of Redux
Cluttering components with route-related code
- Large API surface areas of frameworks like react-router and next.js
- Routing frameworks getting in the way of optimizing animations (such as when animations coincide with component updates).
- Having to do route changes differently in order to support server-side rendering.

### Modules

Managed by [`vizzuality-redux-tools`](https://github.com/vizzuality/redux-tools)

### Sagas

As the router dispatch an action, what we are doing now is listening these actions to trigger some actions and prepare the page as a result of some stored params.

### Services

[`axios`](https://github.com/axios/axios) with [`axios-cache-adapter`](https://github.com/RasCarlito/axios-cache-adapter) will help us to create these services that can be used inside Sagas or Components. Cache adapter stores request results in a configurable store to prevent unneeded network requests.

### Auth
We are using this library to implement authorization and authentication `@auth0/auth0-spa-js`. Each route can have it's own authorization and authentication.

### Map
We are using [REACT-MAP-GL](https://uber.github.io/react-map-gl/#/) to render mapbox. For special things we also use the related libraries like [deck.gl](https://deck.gl/) and [luma.gl](https://luma.gl/).

### Layers

Adding a new layer requires the following steps:

1. Uploading data
2. Generating configs
3. Visualizing data

#### 1. Uploading data

The final goal is to consume a tile url (`http://www.example.com/tiles/{z}/{x}/{y}`). You can have them stored in different places or platforms. We use Cartodb and Mapbox for storing vector layers, GEE will export raster layers.

- Carto: https://carto.com/help/tutorials/import-data-guide/
- Mapbox: https://docs.mapbox.com/studio-manual/overview/geospatial-data/
- Earth Engine: https://developers.google.com/earth-engine/image_upload
- Custom: You can upload an image tileset to some storage service (AWS or GCS bucket with appropriate `<z>/<x>/<y>.png` file structure) and consume a tile url. Note that this method is used primarily for rgb encoded tiles that are to be animated (see section 3, below)

In the case of Carto/Mapbox, the front-end will use the stored config (outlined below) to generate an API call that will retrieve vector tiles with desired styling. Here we can use Carto’s map feature to play around with how the final layer will look with applied styles.

Likewise, for Earth Engine (GEE) rasters stored as assets in some GEE project repo, the front-end will alo generate an API call to retrieve tiles with applied styles specified in the config. Here we use GEE as a sandbox to play around with what the final layer will look like, applying sld styles etc.

For pre-calculated custom tiles however, styles can either be pre-defined when exported to storage (in which case no styles are necessary in the config) or rgb bands are overridden with styles defined in the front end (common for animated encoded layers, see section 3)

#### 2. Generating configs
This config is used to tell Layer Manager how we are going to display the layer, to tell [the Legend](https://vizzuality.github.io/vizzuality-components/#!/Legend) how to display it and the interaction (if it’s possible). Inside the config there are several important attributes.

##### `name`
It will be used to display the legend name

##### `id`
unique id for the layer

##### `slug`
unique slug for the layer

##### `description`
It will be used inside the legend for the info button

##### `layerType`
They could be `raster`, `vector` and `geojson`. It’s very important to know that depending on the type the `layerConfig` generated MUST be different. You should also take into account the `provider`. There is one special case that is carto. This behaviour will change in future updates, but for the moment at version 2.0.2 it works like this.

##### `provider`
It helps Layer Manager to define how it should fetch the layer. Possible options are => `cartodb`, `gee`, `mapbox`

##### `layerConfig`
It will be used by the layer manager to know how to fetch or handle the current layer. 

##### `legendConfig`
It helps us to know how to display the legend. We are using this [Legend Component](https://vizzuality.github.io/vizzuality-components/#!/Legend)

##### `interactionConfig`
It helps us to know how to display the popup.

#### EXAMPLE
```json
{
    "layerConfig": {
      "account": "carto-account",
      "body": {
        "layers": [
          {
            "options": {
              "cartocss": "#selector {  polygon-opacity: 1.0; polygon-fill: #704489 }",
              "cartocss_version": "2.3.0",
              "sql": "SELECT * FROM table"
            },
            "type": "cartodb"
          }
        ],
        "maxzoom": 19,
        "minzoom": 2,
        "vectorLayers": [
          {
            "paint": {
              "fill-color": "#704489",
              "fill-opacity": 1
            },
            "source-layer": "layer0",
            "type": "fill"
          }
        ]
      }
    },
    "legendConfig": {
      "items": [
        {
          "color": "#704489",
          "name": "legend name"
        }
      ],
      "type": "basic"
    },
    "interactionConfig": {
      "output": [
        {
          "column": "name",
          "format": null,
          "prefix": "",
          "property": "Name",
          "suffix": "",
          "type": "string"
        },        
      ]
    },
    "applicationConfig": {
      "order": 0,
      "slug": "slug"
    },
    "staticImageConfig": {}
  }
```

#### 3. Visualizing data

You MUST take into account that all the layers go trough the [layer-manager](https://github.com/Vizzuality/layer-manager). It gives us the possibility of loading layers from different sources, style them, live re-style them by using a json spec. Knowing this, we can talk about the different types of layer we have: Raster, Vector, Geojson.

#### Vector tiles
Vector tiles can come from two sources => **CartoDB** and **Mapbox**. They both use the same [Mapbox spec](https://docs.mapbox.com/mapbox-gl-js/style-spec/?utm_medium=sem&utm_source=google&utm_campaign=sem|google|brand|chko-googlesearch-pr01-dynamicsearchcampaign-nb.broad-all-landingpage-search&utm_term=brand&utm_content=chko-googlesearch-pr01-dynamicsearchcampaign-nb.broad-all-landingpage-search&gclid=CjwKCAiA58fvBRAzEiwAQW-hzVzTrBLk-1yL0afZ3NwljNFGOY2X9pQT0uwQddFVpJyewCaXZ1FZvxoC4KAQAvD_BwE#layers) for styling. This spec has a powerful thing called [expressions](https://docs.mapbox.com/mapbox-gl-js/style-spec/?utm_medium=sem&utm_source=google&utm_campaign=sem|google|brand|chko-googlesearch-pr01-dynamicsearchcampaign-nb.broad-all-landingpage-search&utm_term=brand&utm_content=chko-googlesearch-pr01-dynamicsearchcampaign-nb.broad-all-landingpage-search&gclid=CjwKCAiA58fvBRAzEiwAQW-hzVzTrBLk-1yL0afZ3NwljNFGOY2X9pQT0uwQddFVpJyewCaXZ1FZvxoC4KAQAvD_BwE#expressions) for some properties. Thanks to that you can some data driven properties depending on several things (i.e: different sizes of a circle depending on the zoom, different colors depending on the category, different set of geometries depending on zoom)

Sources:
- [Carto Maps API](https://carto.com/developers/maps-api/)
- [Mapbox Vector Tiles](https://docs.mapbox.com/vector-tiles/reference/?utm_medium=sem&utm_source=google&utm_campaign=sem|google|brand|chko-googlesearch-pr01-dynamicsearchcampaign-nb.broad-all-landingpage-search&utm_term=brand&utm_content=chko-googlesearch-pr01-dynamicsearchcampaign-nb.broad-all-landingpage-search&gclid=CjwKCAiA58fvBRAzEiwAQW-hzRwxpaZKHu6YlHYh36aVRRlB4_cQTg5sh_RCeXzMWLl0nvtKaO05NxoCgNQQAvD_BwE)

###### EXAMPLE
Check `layerConfig.body.layers`. Pay attention of how we are using the Mapbox style spec inside the attribute `vectorLayers`. It's just an example of filtering.

```json
{
  "id": "9d1731ec-d0ef-4afc-afb1-3d478b8bf0c1",
  "type": "layer",
  "name": "All Categories",
  "slug": "All-Categories",
  "dataset": "id",
  "description": "layer description",
  "provider": "cartodb",
  "layerConfig": {
    "account": "carto-account",
    "body": {
      "layers": [
        {
          "options": {
            "cartocss": "#selector {   polygon-opacity: 0.7;  }#selector[iucn_cat='II'] {   polygon-fill: #7c549e;}#selector[iucn_cat='III'] {   polygon-fill: #966db3;}#selector[iucn_cat='IV'] {   polygon-fill: #b087c9;}#selector[iucn_cat='Ia'] {   polygon-fill: #4a2574;}#selector[iucn_cat='Ib'] {   polygon-fill: #633c89;}",
            "cartocss_version": "2.3.0",
            "sql": "SELECT * FROM table"
          },
          "type": "cartodb"
        }
      ],
      "maxzoom": 19,
      "minzoom": 2,
      "vectorLayers": [
        {
          "paint": {
            "fill-opacity": 0.7
          },
          "source-layer": "layer0",
          "type": "fill"
        },
        {
          "paint": {
            "line-opacity": "transparent",
            "line-width": 0
          },
          "source-layer": "layer0",
          "type": "line"
        },
        {
          "filter": [
            "all",
            [
              "==",
              "iucn_cat",
              "II"
            ]
          ],
          "paint": {
            "fill-color": "#7c549e"
          },
          "source-layer": "layer0",
          "type": "fill"
        },
        {
          "filter": [
            "all",
            [
              "==",
              "iucn_cat",
              "III"
            ]
          ],
          "paint": {
            "fill-color": "#966db3"
          },
          "source-layer": "layer0",
          "type": "fill"
        },
        {
          "filter": [
            "all",
            [
              "==",
              "iucn_cat",
              "IV"
            ]
          ],
          "paint": {
            "fill-color": "#b087c9"
          },
          "source-layer": "layer0",
          "type": "fill"
        },
        {
          "filter": [
            "all",
            [
              "==",
              "iucn_cat",
              "Ia"
            ]
          ],
          "paint": {
            "fill-color": "#4a2574"
          },
          "source-layer": "layer0",
          "type": "fill"
        },
        {
          "filter": [
            "all",
            [
              "==",
              "iucn_cat",
              "Ib"
            ]
          ],
          "paint": {
            "fill-color": "#633c89"
          },
          "source-layer": "layer0",
          "type": "fill"
        }        
      ]
    }
  }
}
```

#### Raster tiles
Raster tiles are images that are already styled. You can't restyle them without reloading all the tiles. You consume a tile url and that's it.

###### EXAMPLE
Check `layerConfig.body.url`
```json
{
  "id": "1ea9b4bf-0904-47ae-8ba8-127eefea2ab9",
  "type": "layer",
  "name": "layer name",
  "slug": "layer_slug",
  "dataset": "65af4a9f-6a7e-40d1-ad8e-9137c9493d1d",
  "description": "Description...",
  "provider": "gee",
  "layerConfig": {
    "body": {
      "url": "layer_url"
    }
  },
  "category": "Metrics"
}
```

##### Decoded raster tiles
Decoded raster tiles are tiles that we process before showing them. We style them pixel by pixel depending on some data encoded in the rgb bands of the image. We usually use this kind of layers to filter/animate them (Loss layer and Fire layer).

For example, Loss layer has the accumulate loss for the last 20 years. We encode the year in the b band, then we can show different range of years by hiding the pixels that doesn't belong to this selected range.

How are we doing this? We use deck.gl and luma.gl to decode each image in the GPU using WegGL.

There are two types of preset decodes: `fires` and `treeCoverLoss`.

##### EXAMPLE
See how we are using `params` and `decodeParams`. The difference between them is the effect that they will cause. A change in `params` will trigger a refetch of the entire layer. A change in `decodeParams` will trigger a repaint. That's why we can animate layers during a period of time, by using `decodeParams`.

```json
{
  "id": "dd9cf552-720e-45f1-a92b-22fabb32fda1",
  "type": "layer",
  "name": "layer name",
  "slug": "layer slug",
  "dataset": "084cd3e6-dd90-40ec-9816-eca4862e2131",
  "description": "Description...",
  "layerConfig": {
    "body": {
      "maxzoom": 12,
      "minzoom": 2,
      "url": "layer_url"
    },
    "decode_config": [
      {
        "default": "2001-01-01",
        "key": "startDate",
        "required": true
      },
      {
        "default": "2018-12-31",
        "key": "endDate",
        "required": true
      }
    ],
    "params_config": [
      {
        "default": 12,
        "key": "dataMaxZoom",
        "required": true
      },
      {
        "default": 30,
        "key": "thresh",
        "required": true
      }
    ],
    "type": "tileLayer"
  },
  "params": {
    "dataMaxZoom": 12,
    "thresh": 30
  },
  "decodeParams": {
    "startDate": "2001-01-01",
    "endDate": "2018-12-31",
    "startYear": 2001,
    "startMonth": 0,
    "startDay": 1,
    "endYear": 2018,
    "endMonth": 11,
    "endDay": 365
  },
  "decodeFunction": "\n    // values for creating power scale, domain (input), and range (output)\n    float domainMin = 0.;\n    float domainMax = 255.;\n    float rangeMin = 0.;\n    float rangeMax = 255.;\n\n    float exponent = zoom < 13. ? 0.3 + (zoom - 3.) / 20. : 1.;\n    float intensity = color.r * 255.;\n\n    // get the min, max, and current values on the power scale\n    float minPow = pow(domainMin, exponent - domainMin);\n    float maxPow = pow(domainMax, exponent);\n    float currentPow = pow(intensity, exponent);\n\n    // get intensity value mapped to range\n    float scaleIntensity = ((currentPow - minPow) / (maxPow - minPow) * (rangeMax - rangeMin)) + rangeMin;\n    // a value between 0 and 255\n    alpha = zoom < 13. ? scaleIntensity / 255. : color.g;\n\n    float year = 2000.0 + (color.b * 255.);\n    // map to years\n    if (year >= startYear && year <= endYear && year >= 2001.) {\n      color.r = 220. / 255.;\n      color.g = (72. - zoom + 102. - 3. * scaleIntensity / zoom) / 255.;\n      color.b = (33. - zoom + 153. - intensity / zoom) / 255.;\n    } else {\n      alpha = 0.;\n    }\n  "
}
```

Layers can be defined as placeholder category layers. In order to achieve this, you can add child layers in the admin section "Included layers". the first child layer will be displayed as default when the "category layer" is selected.

Special configs:
1. There are two types of special legend displays: `yearpicker` and `yeardatepicker`. 

```
{
    legendConfig": {
        "legendType": "yearpicker",
        ...other configs
      }
}
```
This will take the child layers from "Included layers" and add a dropdown selector in the layer legend, that allows switching between the child layers.


```
{
    "legendConfig": {      
       "legendType": "yeardatepicker",
        ...other configs
     }
}
```
This will take the child layers from "Included layers" and add a dropdown selector in the layer legend, that allows switching between the child layers.

This is an example of a child layer for this type of parent layer:

```json
{
  "layerConfig": {
    "assetId": "assed_id",
    "type": "tileLayer",
    "timelineConfig": {
      "railStyle": {
        "background": "#333"
      },
      "trackStyle": [
        {
          "background": "#f79a28",
          "top": "50%",
          "transform": "translate(0, -50%)",
          "height": 12,
          "borderRadius": 0,
          "gradient": {
            "{year}0101": "#5A0000",
            "{year}0201": "#7F0101",
            "{year}0301": "#9B0E01",
            "{year}0401": "#BA1001",
            "{year}0501": "#D51301",
            "{year}0601": "#FA1500",
            "{year}0701": "#FF5900",
            "{year}0801": "#FF7E00",
            "{year}0901": "#FFA300",
            "{year}1001": "#FFC800",
            "{year}1101": "#FFEB00",
            "{year}1201": "#FFFF00"
          }
        },
        {
          "background": "#999",
          "top": "50%",
          "transform": "translate(0, -50%)",
          "borderRadius": 0
        }
      ],
      "handleStyle": {
        "opacity": 0
      },
      "step": 1,
      "speed": 75,
      "interval": "days",
      "dateFormat": "YYYY-MM-DD",
      "trimEndDate": "{year}-12-31",
      "maxDate": "{year}-12-31",
      "minDate": "{year}-01-01",
      "canPlay": true
    },
    "paramsConfig": [
      {
        "required": true,
        "key": "year",
        "default": "2001",
        "year": "2001"
      }
    ],
    "decodeConfig": {
      "type": "fire",
      "values": [
        {
          "required": true,
          "key": "startDate",
          "default": "2001-01-01"
        },
        {
          "required": true,
          "key": "endDate",
          "default": "2001-12-31"
        }
      ]
    },
    "body": {
      "url": "tile_url",
      "format": "image/png",
      "options": {
        "useCors": true
      },
      "minzoom": 2,
      "maxzoom": 8
    }
  },
  "legendConfig": {
    "legendType": "yeardatepicker",
    "enable": true
  },
  "interactionConfig": {},
  "applicationConfig": {},
  "staticImageConfig": {}
}

```

The `year` value from `paramsConfig` represents the layer year. In `decodeConfig` you need to setup `startDate` and `endDate`. These dates will be used in the datePickers from the layer legend.

#### Widgets
We use the Widget component for rendering all the widgets. It acts as a wrapper where header, toolbar and footer will be shared. To decide what goes inside you need to render a template that will be unique for each of them.

- For rendering: [Recharts](http://recharts.org/en-US/)
- For number formatting: [d3-format](https://github.com/d3/d3-format)
- For date formatting: [moment](https://momentjs.com/)


## Theming

#### Styling the theme
App styling is done using the `config.scss` file, that exposes a set of variables.

```scss
$marapp-primary-font: 'Primary font';
$marapp-secondary-font: 'Secondary font';
$marapp-icon-font: 'icon-font';

$marapp-color-sucess: #hex;
$marapp-color-error: #hex;

$marapp-primary-color: #hex;
$marapp-secondary-color: #hex;

$marapp-gray-0: #hex;

$marapp-gray-1: #hex;
$marapp-gray-2: #hex;
$marapp-gray-3: #hex;
$marapp-gray-4: #hex;
$marapp-gray-5: #hex;
$marapp-gray-6: #hex;
$marapp-gray-7: #hex;
$marapp-gray-8: #hex;
$marapp-gray-9: #hex;

$marapp-gray-100: #hex;
```
#####Fonts
Font files should be added in `src/fonts` (woff & woff2 files). Then you must declare a font-face inside `src/styles/fonts`.
Those fonts will then be declared as `$marapp-primary-font` and `$marapp-secondary-font`.

#####Primary color
This is the theme color. Some examples of usage: buttons, radio buttons, selected dropdown items.

#####The grays
In order to customize the look and feel of the app, we provide a set of variables that are used inside the scss files.
These can be overwritten by changing the variable value.

Some examples of usage of grays are:

- marapp-gray-0: headings, body text color, icons, legend body text, dropdown body text
- marapp-gray-1: layer name in layers panel, switch not selected bubble color, legend title,modal body text color
- marapp-gray-2: widget chart borders
- marapp-gray-3: outline button border
- marapp-gray-4: not used
- marapp-gray-5: spinner, search box border, layer panel category text
- marapp-gray-6: widget border
- marapp-gray-7: featured places list background, org switcher background, layer panel background
- marapp-gray-8: widget background, legend background, search background
- marapp-gray-9: header background,
- marapp-gray-100: location title background, overlay button active background

#### Javascript variables

Theme Variables that are used trough out the application are stored in `theme.ts` in the src folder.
They enable developers to set up the app name, logo and basemaps, with the use of constants
(`APP_NAME`, `APP_LOGO` and `APP_BASEMAPS`);

#### Generating icons

Marapp uses a default icon font. If you want to customize the icons used, you need to add the icon set svgs in
`@marap/earth-components` in the folder `src/icon-font/icons `and run the command `yarn build-icons`. This generates a compiled folder in icon-font/ with a icon-font.scss
stylesheet. Include that scss file in `index.scss` file and the app will use your custom icons
(`@import "~@marapp/earth-components/src/icon-font/compiled/icon-font";`).


## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment
