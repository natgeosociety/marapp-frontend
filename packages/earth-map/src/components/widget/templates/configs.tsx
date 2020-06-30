import BiodiversityIntactness from './biodiversity-intactness/config';
import Deforestation from './deforestation/config';
import EVI from './evi/config';
import Fires from './fires/config';
import HumanFootprint from './human-footprint/config';
import HumanImpact from './human-impact/config';
import LandCover from './land-cover/config';
import ProtectedArea from './protected-area/config';
import TerrestrialCarbon from './terrestrial-carbon/config';

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
