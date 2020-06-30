import { IWidget } from '../widget/model';
import { ILayer } from '../layers/model';

export interface IIndex {
  type: string;
  id: string;
  slug: string;
  name: string;
  description: string;
  organization?: string;
  published: boolean;
  createdAd: string;
  updatedAt: string;
  layers: ILayer[];
  widgets: IWidget[];
}
