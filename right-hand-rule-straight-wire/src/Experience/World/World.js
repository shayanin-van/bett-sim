import Experience from "../Experience.js";
import Environment from "./Environment.js";
import Wire from "./Wire.js";
import Current from "./Current.js";
import Field from "./Field.js";
import CurlHand from "./CurlHand.js";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    // Wait for resources
    this.resources.on("ready", () => {
      // Setups
      this.environment = new Environment();
      this.wire = new Wire();
      this.current = new Current();
      this.field = new Field();
      this.curlHand = new CurlHand();
    });
  }

  update() {
    if (this.current) {
      this.current.update();
    }
    if (this.field) {
      this.field.update();
    }
    if (this.curlHand) {
      this.curlHand.update();
    }
  }
}
