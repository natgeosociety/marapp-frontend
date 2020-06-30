import {
  AmbientLight,
  DirectionalLight,
  HemisphereLight,
  SphereBufferGeometry,
  MeshPhongMaterial,
  Mesh,
} from 'three';

const backlightTracker = (stage, earth, radius, segments) => {
  const { scene } = stage;

  const geometry = new SphereBufferGeometry(radius + 10, segments, segments);
  const material = new MeshPhongMaterial({ opacity: 0, transparent: true });
  const element = new Mesh(geometry, material);
  element.position.copy(earth.globe.position);
  element.position.setZ(-5);
  scene.add(element);

  return element;
};

export default (stage, earth, radius, segments) => {
  const { scene } = stage;

  const ambient = new AmbientLight('#FFF', 0);
  scene.add(ambient);

  const topLight = new DirectionalLight('#FFF', 0);
  topLight.position.copy(earth.globe.position);
  topLight.position.setY(400);
  scene.add(topLight);

  const backlight = new HemisphereLight('#FFF', 0.3, -1);
  backlight.position.copy(earth.globe.position);
  backlight.position.setX(-10);
  scene.add(backlight);

  const direcitonal = new DirectionalLight('#FFF', 0.2);
  direcitonal.position.set(5.0, 2.0, 5.0).normalize();
  scene.add(direcitonal);

  const lightTracker = backlightTracker(stage, earth, radius, segments);

  return {
    backlight,
    lightTracker,
    direcitonal,
    topLight,
    ambient,
  };
};
