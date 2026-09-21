import * as THREE from "three";
import Experience from "../Experience.js";
import { PI } from "three/tsl";

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
    this.geo = new THREE.TorusGeometry(0.24, 0.01, 16, 48);
    this.mat = new THREE.MeshStandardMaterial({
      color: "#B87333",
      metalness: 0.8,
      roughness: 0,
    });
    this.model = new THREE.Mesh(this.geo, this.mat);
    this.model.rotation.x = Math.PI / 2;

    this.scene.add(this.model);
  }
}
