/*!
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {IconLayer} from '@deck.gl/layers';
import {ICON_LAYER_ID} from './config';
import {IStyle} from './interfaces/style';
import {IIcon} from './interfaces/icon';
import createIconsFromData from './create-icons-from-data';

/**
 * Create a GeoJSON layer from the data
 * Converts the WKT data to GeoJSON
 */
export default function(data: string[][], style?: IStyle): IconLayer {
  return new IconLayer({
    id: ICON_LAYER_ID,
    data: createIconsFromData(data) as any,
    getIcon: (d: IIcon) => {
      if (!style || !style.marker) {
        return getIconByName('small_red');
      }

      const {icon, columnName, buckets} = style.marker;

      if (columnName && buckets && buckets.length > 0) {
        const value = (d.properties && d.properties[columnName]) || 0;
        const bucket =
          buckets.find(
            possibleBucket =>
              value >= possibleBucket.min && value <= possibleBucket.max
          ) || buckets[0];

        return getIconByName(bucket.icon);
      }

      if (columnName) {
        const value = (d.properties && d.properties[columnName]) || 'small_red';
        return getIconByName(value);
      }

      if (icon) {
        return getIconByName(icon);
      }

      return getIconByName('small_red');
    },
    getSize: 48,
    pickable: true
  });
}

/**
 * Get an icon by name
 */
function getIconByName(name: string) {
  const MAPPING: {[key: string]: string} = {
    small_red: 'A',
    small_yellow: 'B',
    small_green: 'C',
    small_blue: 'D',
    small_purple: 'E',
    large_red: 'F',
    large_yellow: 'G',
    large_green: 'H',
    large_blue: 'I',
    large_purple: 'J'
  };
  const iconName = MAPPING[name] || 'A';

  return {
    url: `https://maps.google.com/mapfiles/kml/paddle/${iconName}.png`,
    width: 64,
    height: 64,
    anchorY: 64
  };
}
