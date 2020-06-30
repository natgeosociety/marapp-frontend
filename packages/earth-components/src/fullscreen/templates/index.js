import Photo from './photo';
import Video from './video';
import Photo360 from './360';

export default {
  photo: Photo, // Fallback to support Cesium legacy
  image: Photo,
  video: Video,
  360: Photo360
};

