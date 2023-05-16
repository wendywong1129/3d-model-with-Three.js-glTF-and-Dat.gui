import * as THREE from "three";
import { GridHelper } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default class App {
  static #app = undefined;
  #rootDom = undefined;
  #renderer = undefined;
  #scene = undefined;
  #camera = undefined;
  #resizeHandler = undefined;
  #control = undefined;
  // background = undefined;
  #background = undefined;
  #helper = {
    axesHelper: undefined,
    gridHelper: undefined,
    cameraHelper: undefined,
  };

  // get scene() {
  //   return this.#scene;
  // }

  // get camera() {
  //   return this.#camera;
  // }

  // get renderer() {
  //   return this.#renderer;
  // }

  // get getControl() {
  //   return this.#control;
  // }

  get background() {
    return this.#background;
  }

  set background(color) {
    this.sceneSetBackground(color);
  }

  #isSignalInstance = () => {
    if (App.#app) return false;
    App.#app = this;
    return true;
  };

  #createRootDom = () => document.querySelector("#app");

  #createRenderer = () =>
    new THREE.WebGLRenderer({
      antialias: true,
    });

  #createScene = () => new THREE.Scene();

  #getAspect = () => window.innerWidth / window.innerHeight;
  #createCamera = () =>
    new THREE.PerspectiveCamera(50, this.#getAspect(), 1, 10000);

  #createCameraControl = () =>
    new OrbitControls(this.#camera, this.#renderer.domElement);

  #rendererSetPixel = () =>
    this.#renderer.setPixelRatio(window.devicePixelRatio);
  #rendererSetSize = () =>
    this.#renderer.setSize(window.innerWidth, window.innerHeight);

  #rendererDomAdd = () => this.#rootDom.appendChild(this.#renderer.domElement);

  sceneSetBackground = (color) => {
    this.#scene.background = new THREE.Color(color);
    // this.background = this.#scene.background.getStyle();
    this.#background = this.#scene.background.getStyle();
  };

  #controlAddKeyControl = () => {
    this.#control.listenToKeyEvents(window);
    this.#control.keys = {
      LEFT: "KeyD",
      UP: "KeyS",
      RIGHT: "KeyA",
      BOTTOM: "KeyW",
    };
  };

  #cameraResizeUpdate = () => {
    this.#camera.aspect = this.#getAspect();
    this.#camera.updateProjectionMatrix();
  };

  #render = () => {
    // console.log(this.#control);
    this.#control.update();
    this.#renderer.render(this.#scene, this.#camera);
  };

  #create = () => {
    this.#rootDom = this.#createRootDom();
    this.#renderer = this.#createRenderer();
    this.#scene = this.#createScene();
    this.#camera = this.#createCamera();
    this.#control = this.#createCameraControl();
  };

  #setting = () => {
    this.#rendererSetPixel();
    this.#rendererSetSize();
    this.#rendererDomAdd();
    this.sceneSetBackground(0x222222);
    this.#controlAddKeyControl();
  };

  #rendererResizeUpdate = () => {
    this.#rendererSetSize();
  };
  #event = () => {
    this.#resizeHandler = () => {
      this.#rendererResizeUpdate();
      this.#cameraResizeUpdate();
    };
    window.addEventListener("resize", this.#resizeHandler);
  };

  #animate = () => {
    requestAnimationFrame(this.#animate);
    this.#render();
  };

  #init = () => {
    this.#create();
    this.#setting();
    this.#event();
    this.#animate();
  };

  get getScene() {
    return this.#scene;
  }

  get getCamera() {
    return this.#camera;
  }

  get getRenderer() {
    return this.#renderer;
  }

  get getControl() {
    return this.#control;
  }

  constructor() {
    if (!this.#isSignalInstance()) return App.#app;
    this.#init();
  }

  createAxesHelper = (size = 10) => {
    this.clearAxesHelper();

    const axesHelper = new THREE.AxesHelper(size);
    this.#helper.axesHelper = axesHelper;
    this.#scene.add(axesHelper);
  };

  createGridHelper = (size = 10, divisions = 10) => {
    this.clearGridHelper();

    const gridHelper = new THREE.GridHelper(size, divisions);
    this.#helper.gridHelper = gridHelper;
    this.#scene.add(gridHelper);
  };

  createCameraHelper = () => {
    this.clearCameraHelper();

    const cameraHelper = new THREE.CameraHelper(this.#camera);
    const frustum = new THREE.Color(0xf5222d);
    const cone = new THREE.Color(0xf5222d);
    const up = new THREE.Color(0xf5222d);
    const target = new THREE.Color(0xf5222d);
    const cross = new THREE.Color(0xf5222d);
    cameraHelper.setColors(frustum, cone, up, target, cross);
    this.#helper.cameraHelper = cameraHelper;
    this.#scene.add(cameraHelper);
  };

  hasHelper = (helper) => {
    return !!helper;
  };

  clearHelper = (helper, para) => {
    if (!this.hasHelper(helper[para])) return;
    this.#scene.remove(helper[para]);
    helper[para].dispose();
    helper[para] = undefined;
  };

  clearAxesHelper = () => {
    this.clearHelper(this.#helper, "axesHelper");
  };

  clearGridHelper = () => {
    this.clearHelper(this.#helper, "gridHelper");
  };

  clearCameraHelper = () => {
    this.clearHelper(this.#helper, "cameraHelper");
  };

  hasAxesHelper = () => {
    return this.hasHelper(this.#helper.axesHelper);
  };

  hasGridHelper = () => {
    return this.hasHelper(this.#helper.gridHelper);
  };

  hasCameraHelper = () => {
    return this.hasHelper(this.#helper.cameraHelper);
  };
}
