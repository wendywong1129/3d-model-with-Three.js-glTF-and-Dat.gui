import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import App from "@/App";
import Panel from "@/gui/panel";

export default class Loader {
  #renderer = undefined;
  #scene = undefined;
  #camera = undefined;
  #app = undefined;
  #control = undefined;

  #loaderPath = undefined;
  #loader = new GLTFLoader();
  #model = undefined;
  #gltf = undefined;
  #envLight = undefined;

  #modelBox = {
    self: undefined,
    size: undefined,
    center: undefined,
  };

  #helper = {
    box3Helper: undefined,
  };

  #cameraDataForModelBox = {
    halfBoxSize: undefined,
    halfCameraFovY: undefined,
    camera2boxDistance: undefined,
    direction: undefined,
    directionRemoveY: undefined,
    distanceWithDirection: undefined,
    cameraPosition: undefined,
  };

  constructor(loaderPath, app = new App()) {
    this.#loaderPath = loaderPath;
    // this.#renderer = app.renderer;
    // this.#scene = app.scene;
    // this.#camera = app.camera;
    // this.#control = app.control;
    this.#renderer = app.getRenderer;
    this.#scene = app.getScene;
    this.#camera = app.getCamera;
    this.#control = app.getControl;
    this.#app = app;

    this.#init();
    this.#loading();
  }

  #rendererEncoder = () => {
    this.#renderer.outputEncoding = THREE.sRGBEncoding;
    this.#renderer.gammaOutput = true;
  };

  #sceneLight = () => {
    this.#envLight = new THREE.AmbientLight(0x909090);
    this.#scene.add(this.#envLight);
    this.setEnvLightLevel(3);
  };

  setEnvLightLevel = (number) => {
    this.#envLight.intensity = +number;
  };

  get envLight() {
    return this.#envLight;
  }

  get getModel() {
    return this.#model;
  }

  #init = () => {
    this.#rendererEncoder();
    this.#sceneLight();
  };

  #createModelBox = () => {
    const self = new THREE.Box3().setFromObject(this.#model);
    const size = self.getSize(new THREE.Vector3()).length();
    const center = self.getCenter(new THREE.Vector3());

    this.#modelBox = {
      self,
      size,
      center,
    };
  };

  #genCameraDataForModelBox = () => {
    const halfBoxSize = this.#modelBox.size * 0.5;
    const halfCameraFovY = THREE.MathUtils.degToRad(this.#camera.fov * 0.5);
    const cameraToBoxDistance = halfBoxSize / Math.tan(halfCameraFovY);

    const direction = new THREE.Vector3().subVectors(
      this.#camera.position,
      this.#modelBox.center
    );

    const directionRemoveY = direction
      .multiply(new THREE.Vector3(1, 0, 1))
      .normalize();

    const distanceWithDirection = new THREE.Vector3()
      .copy(directionRemoveY)
      .multiplyScalar(cameraToBoxDistance);

    const cameraPosition = new THREE.Vector3()
      .copy(distanceWithDirection)
      .add(this.#modelBox.center);

    this.#cameraDataForModelBox = {
      halfBoxSize,
      halfCameraFovY,
      cameraToBoxDistance,
      direction,
      directionRemoveY,
      distanceWithDirection,
      cameraPosition,
    };
  };

  setCameraForModel = () => {
    this.#camera.position.copy(this.#cameraDataForModelBox.cameraPosition);
    this.#camera.near = this.#modelBox.size / 100;
    this.#camera.far = this.#modelBox.size * 100;
    this.#camera.updateProjectionMatrix();
    this.#camera.lookAt(
      this.#modelBox.center.x,
      this.#modelBox.center.y,
      this.#modelBox.center.z
    );
  };

  setControlForModel = () => {
    // console.log(this.#control);
    this.#control.maxDistance = this.#modelBox.size * 10;
    this.#control.target.copy(this.#modelBox.center);
    this.#control.autoRotate = true;
    this.#control.update();
  };

  createBox3Helper = (color = 0xffff00) => {
    this.clearBox3Helper();

    const box3Helper = new THREE.Box3Helper(
      this.#modelBox.self,
      new THREE.Color(color)
    );
    this.#scene.add(box3Helper);
    this.#helper.box3Helper = box3Helper;
  };

  clearBox3Helper = () => {
    this.#app.clearHelper(this.#helper, "box3Helper");
  };

  hasBox3Helper = () => {
    return this.#app.hasHelper(this.#helper.box3Helper);
  };

  #getGLTF = async () => {
    return await this.#loader.loadAsync(this.#loaderPath);
  };

  #loading = async () => {
    this.#gltf = await this.#getGLTF();
    this.#model = this.#gltf.scene;

    this.#scene.add(this.#model);

    this.#createModelBox();
    this.#genCameraDataForModelBox();
    this.setCameraForModel();
    this.setControlForModel();

    this.loadPanel = new Panel(this);
  };
}
