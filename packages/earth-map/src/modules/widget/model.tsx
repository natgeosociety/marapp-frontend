import { ILayer } from 'modules/layers/model';

export interface IWidget {
  type: string;
  id: string;
  slug: any;
  name: string;
  description: string;
  published: boolean;
  metrics: string[];
  createdAt: Date;
  updatedAt: Date;
  version: number;
  layers: ILayer[];
  config: any;

  widgetConfig: IWidgetConfig;
}

export interface IWidgetConfig {
  dataIndex: string;
  layer: string;
  legendConfig: any;
  paramsConfig: any;
  sentence: any;
  sentenceConfig: any;
  slug: string;
  type: 'vertical_bar' | 'pie_widget';
}
