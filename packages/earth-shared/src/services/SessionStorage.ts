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

interface Storage {
  get(key: string): string;
  getObject(key: string, defaultValue?: any): any;
  remove(key: string): void;
  add(key: string, value: string): void;
}

class SessionStorage implements Storage {
  constructor() {}

  add(key: string, value: string): void {
    return sessionStorage.setItem(key, value);
  }

  get(key: string): string {
    return sessionStorage.getItem(key);
  }

  getObject(key: string, defaultValue: any = {}): any {
    try {
      const encoded = this.get(key);
      return JSON.parse(encoded) || defaultValue;
    } catch (err) {
      console.error('[getObject]: ' + err);
      return defaultValue;
    }
  }

  remove(key: string): void {
    return sessionStorage.removeItem(key);
  }
}

export default new SessionStorage();
