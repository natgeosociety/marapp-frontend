import BiodiversityIntactness from './biodiversity-intactness';
import Deforestation from './deforestation';
import EVI from './evi';
import Fires from './fires';
import HumanFootprint from './human-footprint';
import HumanImpact from './human-impact';
import LandCover from './land-cover';
import ProtectedArea from './protected-area';
import TerrestrialCarbon from './terrestrial-carbon';

export default {
  'biodiversity-intactness': BiodiversityIntactness,
  'tree-loss': Deforestation,
  'modis-evi': EVI,
  'modis-fire': Fires,
  'human-footprint': HumanFootprint,
  'human-impact': HumanImpact,
  'land-use': LandCover,
  'protected-areas': ProtectedArea,
  'terrestrial-carbon': TerrestrialCarbon,
};
