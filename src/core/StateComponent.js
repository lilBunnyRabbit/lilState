/**
 * Class representing StateComponent for selected StateElement's.
 * The purpose of this class is to be extended and override its "$onStateChange" method to listen to events.
 * @class
 */
export default class StateComponent {
  /**
   * State that the component belongs to.
   * @private
   * @type {State}
   */
  #state = null;

  /**
   * Object of attached StateElement's.
   * @type {Object.<string, StateElement>}
   */
  states = {};

  /**
   * Create new StateComponent.
   * @constructor
   * @param {State} state - State that the StateComponent belongs to.
   * @param {string[] | boolean} [elements]
   *   - If list of StateElement keys: those StateElement's will be attached.
   *     If "true": all initialized StateElement's will be attached.
   *     If "falsy": no StateElement will be attached but if a listenere is present it will listen to all initialized StateElement's.
   */
  constructor(state, elements) {
    this.#state = state;

    const prototype = Object.getPrototypeOf(this);
    const overrides = {
      $onStateChange: prototype.hasOwnProperty("$onStateChange"),
    };

    let events = [];
    if (elements === true) {
      for (const element of this.#state.elements.values()) {
        const key = element.key;
        events.push(key);
        this.states[key] = element;
        if (overrides.$onStateChange) {
          this.states[key].addListener((value) => this.$onStateChange(key, value));
        }
      }
    } else if (elements) {
      events = elements;
      elements.forEach((key) => {
        this.states[key] = this.#state.attach(key);
        if (overrides.$onStateChange) {
          this.states[key].addListener((value) => this.$onStateChange(key, value));
        }
      });
    } else if (overrides.$onStateChange) {
      events.push("change");
      this.#state.addEventListener("change", ({ detail }) => this.$onStateChange(detail.key, detail.value));
    }

    Object.freeze(this.states);

    if (this.#state.config.useLogs) {
      console.log("StateComponent", {
        class: this.constructor.name,
        stateElements: Object.keys(this.states),
        overrides,
        events,
      });
    }
  }

  /**
   * Triggers when any of the attached StateElement's is changed.
   * If no StateElement is attached it will emit when any initialized StateElement is changed.
   * @param {string} key
   * @param {StorageValue} value
   * @abstract
   */
  $onStateChange(key, value) {
    console.log(this.constructor.name, "$onStateChange", { key, value });
  }

  /**
   * Reset all attached StateElement's to their default value.
   */
  $resetAll() {
    Object.keys(this.states).forEach((key) => this.states[key].reset());
  }
}
