import { Layer } from '../layers/model';
import { Widget } from '../widgets/model';

export interface Dashboard {
  id: string;
  slug: string;
  name: string;
  description: string;
  published: boolean;
  layers?: string[] | Layer[];
  widgets?: string[] | Widget[];
}

export interface DashboardProps {
  data: Dashboard;
  newDashboard?: boolean;
}
