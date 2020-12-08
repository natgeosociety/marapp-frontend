/*
 * Copyright 2018-2020 National Geographic Society
 *
 * Use of this software does not constitute endorsement by National Geographic
 * Society (NGS). The NGS name and NGS logo may not be used for any purpose without
 * written permission from NGS.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use
 * this file except in compliance with the License. You may obtain a copy of the
 * License at
 *
 *   https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed
 * under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */
// @ts-nocheck
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { Elang } from '../locales';
import SessionStorage from '../services/SessionStorage';

import translationEN from './en/translation.json';
import translationES from './es/translation.json';
import translationFR from './fr/translation.json';
import translationENAdmin from './en/admin.translation.json';
import translationESAdmin from './es/admin.translation.json';
import translationFRAdmin from './fr/admin.translation.json';

import * as weglot from './weglot';

interface ITranslationService {
  init(): void;
}

class TranslationService implements ITranslationService {
  constructor() {}

  init(weglotApiKey) {
    const lang = SessionStorage.get('lang') || Elang.EN;

    i18n.on('initialized', async (options) => {
      await weglot.init(weglotApiKey);

      weglot.changeLanguage(options.lng);
    });

    i18n.use(initReactI18next).init({
      resources: {
        [Elang.EN]: {
          translation: translationEN,
          admin: translationENAdmin,
        },
        [Elang.ES]: {
          translation: translationES,
          admin: translationESAdmin,
        },
        [Elang.FR]: {
          translation: translationFR,
          admin: translationFRAdmin,
        },
      },
      lng: lang,
      fallbackLng: Elang.EN,
      interpolation: {
        escapeValue: false,
      },
      keySeparator: false,
    });

    i18n.on('languageChanged', (lng) => {
      weglot.changeLanguage(lng);

      SessionStorage.add('lang', lng);
    });
  }
}

export default new TranslationService();
