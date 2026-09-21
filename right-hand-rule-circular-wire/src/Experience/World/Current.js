import * as THREE from "three";
import Experience from "../Experience.js";

export default class Current {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.time = this.experience.time;
    this.world = this.experience.world;

    // Material
    this.material = new THREE.MeshStandardMaterial({
      color: "#58c4f5",
      roughness: 0,
    });

    // Parameters
    this.nLump = 16;
    this.dotsPerLump = 8;
    this.dotsSpacing = 0.0008;
    this.speedFactor = 0.06;
    this.radius = 0.24;

    // Geometry
    this.geometry = new THREE.SphereGeometry(0.0106, 32, 10);

    this.setModel();
  }

  setModel() {
    this.currentDots = [];

    for (let i = 0; i < this.nLump; i++) {
      for (let j = 0; j < this.dotsPerLump; j++) {
        let dot = new THREE.Mesh(this.geometry, this.material);
        dot.posRatio = i / this.nLump + this.dotsSpacing * j;
        dot.position.copy(this.calcPosition(dot.posRatio));

        this.currentDots.push(dot);
        this.scene.add(dot);
      }
    }
  }

  update() {
    if (isOn) {
      this.show();
    } else {
      this.hide();
    }

    if (isDown) {
      this.currentDots.forEach((element) => {
        element.posRatio += this.speedFactor * this.time.delta;
        element.posRatio = element.posRatio % 1;
        element.position.copy(this.calcPosition(element.posRatio));
      });
    } else {
      this.currentDots.forEach((element) => {
        element.posRatio -= this.speedFactor * this.time.delta;
        if (element.posRatio < 0) {
          element.posRatio = 1 + element.posRatio;
        }
        element.position.copy(this.calcPosition(element.posRatio));
      });
    }
  }

  calcPosition(posRatio) {
    return new THREE.Vector3(
      this.radius * Math.cos(posRatio * 6 * Math.PI),
      0,
      this.radius * Math.sin(posRatio * 6 * Math.PI)
    );
  }

  hide() {
    this.currentDots.forEach((element) => {
      element.visible = false;
    });
  }

  show() {
    this.currentDots.forEach((element) => {
      element.visible = true;
    });
  }
}
