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
let Weglot;

if (typeof window !== `undefined`) {
  Weglot = window['Weglot'];
}

export function init(weglotApiKey): Promise<any> {
  if (!Weglot) {
    return;
  }

  const resolver = new Promise((resolve) => Weglot.on('initialized', resolve));

  Weglot.initialize({
    api_key: weglotApiKey,
    dynamic: '.translate-content',
    exceptions: '.translate-content-ignore',
    hide_switcher: true,
    cache: true,
  });

  return resolver;
}

export function getAvailableLanguages(): string[] {
  if (!Weglot) {
    return [];
  }

  return [
    Weglot.options.language_from,
    ...Weglot.options.languages.map((lang) => lang.language_to),
  ];
}

export function changeLanguage(lang: string): void {
  if (!Weglot) {
    return;
  }

  const availableLanguages = getAvailableLanguages();

  if (availableLanguages.includes(lang)) {
    Weglot.switchTo(lang);
  } else {
    const fallbackLang = Weglot.options.language_from;
    Weglot.switchTo(fallbackLang);

    console.error(`Language ${lang} is not available. Fallback to ${fallbackLang}`);
  }
}
