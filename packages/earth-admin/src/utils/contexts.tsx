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

import * as React from 'react';
import { Layer } from 'components/layers/model';
import { LocationContextProps } from 'components/locations/model';
import { User } from 'components/users/model';
import { Organization } from 'components/organizations/model';
import { Widget } from 'components/widgets/model';
import { Dashboard } from 'components/dashboards/model';
import { Auth0 } from 'auth/model';

export const LocationContext = React.createContext<LocationContextProps | null>(null);
export const LayerContext = React.createContext<Layer[] | null>(null);
export const UserContext = React.createContext<User[] | null>(null);
export const OrganizationContext = React.createContext<Organization[] | null>(null);
export const WidgetContext = React.createContext<Widget[] | null>(null);
export const DashboardContext = React.createContext<Dashboard[] | null>(null);

export const Auth0Context = React.createContext<Auth0>({});

export const MapComponentContext = React.createContext<any>({});
