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

//todo remove this, take from layer config

const decodes = {
  treeCoverLoss: `
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
  `,
  fires: `
    // float months[12] = float[12](31., 28., 31., 30., 31., 30., 31., 31., 30., 31., 30., 31.);
    float months[12];
    months[0] = 31.;
    months[1] = 28.;
    months[2] = 31.;
    months[3] = 30.;
    months[4] = 31.;
    months[5] = 30.;
    months[6] = 31.;
    months[7] = 31.;
    months[8] = 30.;
    months[9] = 31.;
    months[10] = 30.;
    months[11] = 31.;


    vec3 monthColors[12];
    monthColors[0] = vec3(0.35,0.,0.);
    monthColors[1] = vec3(0.5,0.,0.);
    monthColors[2] = vec3(0.61,0.05,0.);
    monthColors[3] = vec3(0.73,0.06,0.);
    monthColors[4] = vec3(0.84,0.07,0.);
    monthColors[5] = vec3(0.98,0.08,0.);
    monthColors[6] = vec3(1.,0.35,0.);
    monthColors[7] = vec3(1.,0.49,0.);
    monthColors[8] = vec3(1.,0.64,0.);
    monthColors[9] = vec3(1.,0.78,0.);
    monthColors[10] = vec3(1.,0.92,0.);
    monthColors[11] = vec3(1.,1.,0.);


    float r = color.r * 255.;
    float g = color.g * 255.;
    float b = color.b * 255.;
    float day = r + (g * 255.);

    float sum = 0.;

    int month = 0;
    vec3 monthColor = vec3(1., 0., 0.);

    for (int i = 0; i < 12; i++) {
      if (day >= sum) {
        month = i;
        monthColor = monthColors[i];
      }

      sum += months[i];
    }

    // map to days
    if (day >= startDay && day <= endDay) {
      color = monthColor;
    } else {
      alpha = 0.;
    }
  `,
};

export default {
  fire: decodes.fires,
  treeCoverLoss: decodes.treeCoverLoss,
};
