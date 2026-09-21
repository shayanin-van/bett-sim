import * as THREE from "three";
import Experience from "../Experience.js";

export default class Wire {
  constructor() {
    this.experience = new Experience();
    this.resources = this.experience.resources;
    this.scene = this.experience.scene;
    this.world = this.experience.world;
    this.time = this.experience.time;

    this.setModel();
  }

  setModel() {
    this.geo = new THREE.CylinderGeometry(0.006, 0.006, 2, 32, 1, true);
    this.mat = new THREE.MeshStandardMaterial({
      color: "#B87333",
      metalness: 0.8,
      roughness: 0,
    });
    this.model = new THREE.Mesh(this.geo, this.mat);

    this.scene.add(this.model);
  }
}
