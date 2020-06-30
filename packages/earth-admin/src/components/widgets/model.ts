export interface Widget {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string[];
  config: object;
  published: boolean;
  metrics: string[];
  createdAt?: Date;
  updatedAt?: Date;
  version?: number;
  layers?: string[];
}

export interface WidgetProps {
  data: Widget;
  newWidget?: boolean;
}
