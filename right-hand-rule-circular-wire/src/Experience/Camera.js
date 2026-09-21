import * as THREE from "three";
import Experience from "./Experience.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { DragControls } from "three/examples/jsm/controls/DragControls.js";

export default class Camera {
  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;

    this.setInstance();
    this.setControls();
    this.setDrag();
  }

  setInstance() {
    this.instance = new THREE.PerspectiveCamera(
      35,
      this.sizes.width / this.sizes.height,
      0.01,
      100
    );
    this.instance.position.set(0.8, 0.6, 0.8);
    this.scene.add(this.instance);
  }

  setControls() {
    this.controls = new OrbitControls(this.instance, this.canvas);
    this.controls.enableDamping = true;
    this.controls.target.set(0, 0, 0);
    this.controls.enablePan = false;
    this.controls.enableZoom = false;
  }

  setDrag() {
    this.drag = new DragControls([], this.instance, this.canvas);
    this.drag.recursive = false;
    this.drag.enabled = true;
    this.drag.rotateSpeed = 0;

    this.drag.addEventListener("dragstart", () => {
      this.controls.enabled = false;
      this.drag.addEventListener(
        "dragend",
        () => {
          this.controls.enabled = true;
        },
        { once: true }
      );
    });
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  update() {
    this.controls.update();
  }
}
