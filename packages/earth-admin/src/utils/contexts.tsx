import * as React from 'react';
import { Layer } from 'components/layers/model';
import { LocationContextProps } from 'components/locations/model';
import { User } from 'components/users/model';
import { Widget } from 'components/widgets/model';
import { Dashboard } from 'components/dashboards/model';
import { Auth0 } from 'auth/model';

export const LocationContext = React.createContext<LocationContextProps | null>(null);
export const LayerContext = React.createContext<Layer[] | null>(null);
export const UserContext = React.createContext<User[] | null>(null);
export const WidgetContext = React.createContext<Widget[] | null>(null);
export const DashboardContext = React.createContext<Dashboard[] | null>(null);

export const Auth0Context = React.createContext<Auth0>({});

export const MapComponentContext = React.createContext<any>({});
