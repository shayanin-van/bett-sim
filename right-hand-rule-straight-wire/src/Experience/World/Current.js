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

    // Geometry
    this.geometry = new THREE.SphereGeometry(0.0062, 32, 10);

    // Parameters
    this.nLump = 24;
    this.dotsPerLump = 16;
    this.dotsSpacing = 0.0008;
    this.speedFactor = 0.06;

    // Current's track
    this.fixPoints = [new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, -1, 0)];
    this.nSections = this.fixPoints.length;
    this.sectionLength = [];
    this.cumuSectionLength = [];
    for (let i = 0; i < this.nSections - 1; i++) {
      this.sectionLength.push(
        this.fixPoints[i].distanceTo(this.fixPoints[i + 1])
      );
      this.cumuSectionLength.push(
        this.sectionLength.reduce((a, b) => a + b, 0)
      );
    }
    this.totalLength =
      this.cumuSectionLength[this.cumuSectionLength.length - 1];

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
        this.world.wire.model.add(dot);
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
    let travelDist = posRatio * this.totalLength;
    let sectionIndex = 0;
    let lerpRatio;
    for (let i = 0; i < this.nSections; i++) {
      if (travelDist > this.cumuSectionLength[i]) {
        sectionIndex = i + 1;
      }
    }
    if (sectionIndex == 0) {
      lerpRatio = travelDist / this.sectionLength[0];
    } else {
      lerpRatio =
        (travelDist - this.cumuSectionLength[sectionIndex - 1]) /
        this.sectionLength[sectionIndex];
    }

    return new THREE.Vector3(0, 0, 0).lerpVectors(
      this.fixPoints[sectionIndex],
      this.fixPoints[sectionIndex + 1],
      lerpRatio
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
