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

import compose from 'lodash/fp/compose'

/**
 * Receives an error message and returns a function that receives a valid flag.
 * Returns either the error message or the valid flag for react-hook-form to use
 */
const maybeShowError = (errorMessage: string) =>
  (valid: boolean): string | boolean => valid ? valid : errorMessage;

/**
 * Return true if value has any special characters in it
 */
const noSpecialChars = (value: string): boolean => {
  const regex = RegExp(/^(?:[A-Za-z]+)(?:[A-Za-z0-9 _]*)$/);
  return regex.test(value);
}

/**
 * Return true if value contains special characters or space.
 */
const noSpecialCharsOrSpace = (value: string): boolean => {
  const regex = RegExp('^[a-z0-9](-?[a-z0-9])*$');
  return regex.test(value);
}

/**
 * Return true if email is not valid format
 */
const validEmail = (email: string): boolean => {
  const rule = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return rule.test(email.toLowerCase());
}

/**
 * Validation rules used by react-hook-form
 * Allow for message customization
 */

export const noSpecialCharsRule = (
  errorMessage: string = 'Special characters are not allowed'
) => compose(maybeShowError(errorMessage), noSpecialChars);

export const validEmailRule = (
  errorMessage: string = 'Invalid email address'
) => compose(maybeShowError(errorMessage), validEmail);

export const noSpecialCharsOrSpaceRule = (
  errorMessage: string = 'Special characters or space are not allowed'
) => compose(maybeShowError(errorMessage), noSpecialCharsOrSpace);

export const setupErrors = (errors, touched) =>
  (field: string): string => {
    const fieldErr: any = errors[field];
    if (!fieldErr) {
      return;
    }

    // render error only after user interacted with the field
    if (touched[field] && fieldErr.message) {
      return fieldErr.message;
    }
  }
