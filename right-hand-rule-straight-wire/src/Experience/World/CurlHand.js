import * as THREE from "three";
import Experience from "../Experience.js";

export default class CurlHand {
  constructor() {
    this.experience = new Experience();
    this.resources = this.experience.resources;
    this.scene = this.experience.scene;
    this.world = this.experience.world;
    this.time = this.experience.time;

    // Resource
    this.resource = this.resources.items.curlHand;

    this.setCurlHand();

    // axes helper (for dev purpose)
    // this.axis = new THREE.AxesHelper(10);
    // this.scene.add(this.axis);
  }

  setCurlHand() {
    this.resource.scene.traverse((child) => {
      if (child.name === "curlHand") {
        this.model = child;
      }
    });

    this.scene.add(this.model);
  }

  update() {
    if (isOn) {
      this.model.visible = true;
    } else {
      this.model.visible = false;
    }

    if (isDown) {
      this.model.rotation.z = Math.PI / 2;
      this.model.rotation.y = Math.PI;
    } else {
      this.model.rotation.z = -Math.PI / 2;
      this.model.rotation.y = 0;
    }
  }
}
