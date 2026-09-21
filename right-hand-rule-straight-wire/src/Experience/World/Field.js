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
    this.yStart = -0.25;
    this.yEnd = 0.25;
    this.yWidth = this.yEnd - this.yStart;
    this.nAlongY = 6;

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

      for (let i = 0; i <= this.nAlongY; i++) {
        const points = this.createCircularPoints(
          64,
          Math.pow(j + 1, 1.8) * 0.02,
          this.yStart + (i * this.yWidth) / this.nAlongY
        );

        const fieldLineGeo = new THREE.BufferGeometry().setFromPoints(points);

        fieldLines[i] = new THREE.Line(fieldLineGeo, this.material);
        fieldLines[i].computeLineDistances();
        this.world.wire.model.add(fieldLines[i]);
      }

      this.fieldLineLayer[j] = fieldLines;
    }
  }

  createCircularPoints(nSection, radius, y) {
    let points = [];
    for (let i = 0; i <= nSection; i++) {
      points.push(
        new THREE.Vector3(
          -radius * Math.cos((i * 2 * Math.PI) / nSection),
          y,
          -radius * Math.sin((i * 2 * Math.PI) / nSection)
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
  }

  show() {
    for (let j = 0; j < this.fieldLineLayer.length; j++) {
      for (let i = 0; i < this.fieldLineLayer[j].length; i++) {
        this.fieldLineLayer[j][i].visible = true;
      }
    }
  }
}
