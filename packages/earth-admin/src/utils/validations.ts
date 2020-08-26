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

/**
 * React-hook-form validation.
 * Show error if string contains special characters.
 */
export const noSpecialChars = (value: string): boolean => {
  const regex = RegExp('^[a-z0-9](-?[a-z0-9])*$');
  return regex.test(value);
}


export const setupErrors = (errors, touched) =>
  (field: string, customErr?: string): string => {
    const errorMapping = {
      noSpecialChars: 'Special characters are not allowed'
    };
    const fieldErr: any = errors[field];
    if (!fieldErr) {
      return;
    }
    // render error only after user interacted with the field
    // default error has priority over custom one
    if (touched[field] && fieldErr.message) {
      return fieldErr.message;
    }
    // render error as they type
    if (customErr) {
      const text = errorMapping[fieldErr.type]
      return text;
    }
  }
