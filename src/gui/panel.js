import { GUI } from "dat.gui";
import App from "@/App";

export default class Panel {
  #loader = undefined;
  #scene = undefined;
  #camera = undefined;
  #control = undefined;
  #renderer = undefined;
  #app = undefined;
  #model = undefined;

  #gui = new GUI();

  #switchAxesHelperHandler = undefined;
  #switchGridHelperHandler = undefined;
  #switchCameraHelperHandler = undefined;
  #switchBox3HelperHandler = undefined;

  controlBtn = {
    autoRotate: () => {
      this.#control.autoRotate = !this.#control.autoRotate;
      this.updateAutoRotateState();
    },
    resetPosition: () => {
      this.#control.reset();
      this.#loader.setCameraForModel();
      this.#loader.setControlForModel();
      this.updateAutoRotateState();
    },
    switchAxesHelper: () => {
      // if (this.#app.hasAxesHelper()) {
      //   this.#app.clearAxesHelper();
      // } else {
      //   this.#app.createAxesHelper();
      // }
      this.#app.hasAxesHelper()
        ? this.#app.clearAxesHelper()
        : this.#app.createAxesHelper(100);

      // this.#switchAxesHelperHandler.name(
      //   "Switch Axes Helper: " + this.#app.hasAxesHelper()
      // );
      this.updateSwitchAxesHelperState();
    },
    switchGridHelper: () => {
      this.#app.hasGridHelper()
        ? this.#app.clearGridHelper()
        : this.#app.createGridHelper(150, 10);

      this.updateSwitchGridHelperState();
    },
    switchCameraHelper: () => {
      this.#app.hasCameraHelper()
        ? this.#app.clearCameraHelper()
        : this.#app.createCameraHelper(150, 10);

      this.updateSwitchCameraHelperState();
    },
    switchBox3Helper: () => {
      this.#loader.hasBox3Helper()
        ? this.#loader.clearBox3Helper()
        : this.#loader.createBox3Helper();

      this.updateSwitchBox3HelperState();
    },
  };

  updateAutoRotateState = () => {
    this.controlAutoRotateHandler.name(
      "Auto Rotate: " + this.#control.autoRotate
    );
  };

  updateSwitchAxesHelperState = () => {
    this.#switchAxesHelperHandler.name(
      "Switch Axes Helper: " + this.#app.hasAxesHelper()
    );
  };

  updateSwitchGridHelperState = () => {
    this.#switchGridHelperHandler.name(
      "Switch Grid Helper: " + this.#app.hasGridHelper()
    );
  };

  updateSwitchCameraHelperState = () => {
    this.#switchCameraHelperHandler.name(
      "Switch Camera Helper: " + this.#app.hasCameraHelper()
    );
  };

  updateSwitchBox3HelperState = () => {
    this.#switchBox3HelperHandler.name(
      "Switch Box3 Helper: " + this.#loader.hasBox3Helper()
    );
  };

  #PanelAdd() {
    const cameraFolder = this.#gui.addFolder("CAMERA");
    cameraFolder.open();

    const cameraPositionX = cameraFolder
      .add(this.#camera.position, "x")
      .name("camera.pos.x")
      .listen();
    const cameraPositionY = cameraFolder
      .add(this.#camera.position, "y")
      .name("camera.pos.y")
      .listen();
    const cameraPositionZ = cameraFolder
      .add(this.#camera.position, "z")
      .name("camera.pos.z")
      .listen();

    const controlFolder = this.#gui.addFolder("CONTROL");
    controlFolder.open();

    // controlFolder.add(this.#control, "autoRotate").name("autoRotate").listen();

    this.controlAutoRotateHandler = controlFolder
      .add(this.controlBtn, "autoRotate")
      .listen();
    this.updateAutoRotateState();

    controlFolder
      .add(this.#control, "autoRotateSpeed", -10, 10, 0.1)
      .name("Auto Rotate Speed")
      .listen();

    controlFolder
      .add(this.controlBtn, "resetPosition")
      .name("Reset Position")
      .listen();

    controlFolder
      .add(this.#loader.envLight, "intensity", 0, 10, 0.1)
      .name("Env Light Intensity")
      .listen();

    controlFolder
      .addColor(this.#app, "background")
      .onChange((e) => {
        this.#app.sceneSetBackground(e);
      })
      .name("Background");

    this.#switchAxesHelperHandler = controlFolder
      .add(this.controlBtn, "switchAxesHelper")
      .name("Switch Axes Helper");
    this.updateSwitchAxesHelperState();

    this.#switchGridHelperHandler = controlFolder
      .add(this.controlBtn, "switchGridHelper")
      .name("Switch Grid Helper");
    this.updateSwitchGridHelperState();

    this.#switchCameraHelperHandler = controlFolder
      .add(this.controlBtn, "switchCameraHelper")
      .name("Switch Camera Helper");
    this.updateSwitchCameraHelperState();

    this.#switchBox3HelperHandler = controlFolder
      .add(this.controlBtn, "switchBox3Helper")
      .name("Switch Box3 Helper");
    this.updateSwitchBox3HelperState();
  }

  constructor(loader, app = new App()) {
    this.#loader = loader;
    this.#scene = app.getScene;
    this.#camera = app.getCamera;
    this.#renderer = app.getRenderer;
    this.#control = app.getControl;
    this.#app = app;
    this.#model = loader.getModel;
    this.#PanelAdd();
  }
}
