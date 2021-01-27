export interface IRouter {
  type: EarthRoutes;
  payload: any;
  prev: any;
  query: any;
}

export enum EarthRoutes {
  EARTH = 'EARTH',
  LOCATION = 'LOCATION',
  COLLECTION = 'COLLECTION',
  NEW_COLLECTION = 'NEW_COLLECTION',
}
