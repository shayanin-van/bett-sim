import * as THREE from "three";
import Experience from "../Experience.js";

export default class Field {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.time = this.experience.time;
    this.world = this.experience.world;

    // Parameters
    this.nLayer = 4;
    this.nAlongRing = 6;

    // Shader Variable
    this.timeUniform = {
      uTime: { value: 0 },
    };

    // Material
    this.material = new THREE.LineDashedMaterial({
      color: "green",
      dashSize: 0.02,
      gapSize: 0.02,
    });
    this.material.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = this.timeUniform.uTime;
      shader.fragmentShader = shader.fragmentShader.replace(
        "uniform float totalSize;",
        "uniform float totalSize; uniform float uTime;"
      );
      shader.fragmentShader = shader.fragmentShader.replace(
        "mod( vLineDistance, totalSize ) > dashSize",
        "mod( vLineDistance + uTime, totalSize ) > dashSize"
      );
    };

    this.setModel();
  }

  setModel() {
    this.fieldLineLayer = [];

    for (let j = 0; j < this.nLayer; j++) {
      let fieldLines = [];

      for (let i = 0; i <= this.nAlongRing; i++) {
        let portion = 1 - j / this.nLayer;
        if (j == 1) {
          portion = 1;
        }
        const points = this.createCircularPoints(
          64,
          Math.pow(j + 1, 1.8) * 0.04,
          (0.24 + Math.pow(j, 1.8) * 0.04) *
            Math.cos((i * 2 * Math.PI) / this.nAlongRing),
          (0.24 + Math.pow(j, 1.8) * 0.04) *
            Math.sin((i * 2 * Math.PI) / this.nAlongRing),
          portion
        );

        const fieldLineGeo = new THREE.BufferGeometry().setFromPoints(points);

        fieldLines[i] = new THREE.Line(fieldLineGeo, this.material);
        fieldLines[i].computeLineDistances();
        this.scene.add(fieldLines[i]);
      }

      this.fieldLineLayer[j] = fieldLines;
    }

    this.middleLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0.35, 0),
        new THREE.Vector3(0, -0.35, 0),
      ]),
      this.material
    );
    this.middleLine.computeLineDistances();
    this.scene.add(this.middleLine);
  }

  createCircularPoints(nSection, radius, xC, zC, portion) {
    let points = [];
    let angleToOrigin = Math.atan2(zC, xC);
    for (let i = 0; i <= nSection; i++) {
      let angle =
        (i * portion * 2 * Math.PI) / nSection - (portion * 2 * Math.PI) / 2;
      points.push(
        new THREE.Vector3(
          xC - radius * Math.cos(angle) * Math.cos(angleToOrigin),
          -radius * Math.sin(angle),
          zC - radius * Math.cos(angle) * Math.sin(angleToOrigin)
        )
      );
    }
    return points;
  }

  update() {
    if (isOn) {
      this.show();
    } else {
      this.hide();
    }

    if (isDown) {
      this.timeUniform.uTime.value += -this.time.delta / 10;
    } else {
      this.timeUniform.uTime.value += this.time.delta / 10;
    }
  }

  hide() {
    for (let j = 0; j < this.fieldLineLayer.length; j++) {
      for (let i = 0; i < this.fieldLineLayer[j].length; i++) {
        this.fieldLineLayer[j][i].visible = false;
      }
    }
    this.middleLine.visible = false;
  }

  show() {
    for (let j = 0; j < this.fieldLineLayer.length; j++) {
      for (let i = 0; i < this.fieldLineLayer[j].length; i++) {
        this.fieldLineLayer[j][i].visible = true;
      }
    }
    this.middleLine.visible = true;
  }
}
