import { LocationTypeEnum } from '../places/model';

export interface ILastViewedPlace {
  id: string;
  name: string;
  slug: string;
  organization: string;
  mainType: EMainType;
  subType: LocationTypeEnum | 'Collection';
}

export enum EMainType {
  LOCATION = 'LOCATION',
  COLLECTION = 'COLLECTION',
}

// There is not way to extend enums, this is a workaround
export const SubType = {
  ...LocationTypeEnum,
  COLLECTION: 'Collection',
};
