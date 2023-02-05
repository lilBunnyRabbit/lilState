/**
 * Class representing state for unique key.
 * The purpose of this class is to control a specific State element.
 * @class
 */
export default class StateElement {
  /**
   * StateElement configuration.
   * @typedef {Object} StateElementConfig
   * @property {boolean} [useLocalStorage] - Enable/disable using local storage for storing and retrieving data.
   * @property {boolean} [useEvents] - Enable/disable "change" event for the element.
   * @property {function(StorageValue): StorageValue} [onBeforeSet] - Callback before the value is set.
   * @property {boolean} [useRefetchOnFocus] - Refetch from local storage on window focus if `useLocalStorage` is set.
   */

  /**
   * StateElement options for creation.
   * @typedef {Object} StateElementOptions
   * @property {StorageValue} defaultValue - Default value used when reseting and when no value is stored in local storage.
   * @property {StateElementConfig} [config] - StateElement configuration.
   */

  /**
   * State that the StateElement belongs to.
   * @private
   * @type {State}
   */
  #state = null;

  /**
   * StateElement's unique key.
   * @private
   * @type {string}
   */
  #key = "";

  /**
   * StateElement's default value.
   * @private
   * @type {StorageValue}
   */
  #defaultValue = undefined;

  /**
   * StateElement's default value type.
   * @private
   * @type {StorageValueType}
   */
  #type = "";

  /**
   * StateElement's configuration.
   * @private
   * @type {StateElementConfig}
   */
  #config = {
    useLocalStorage: false,
    useEvents: false,
    onBeforeSet: null,
    useRefetchOnFocus: true,
  };

  /**
   * Create new StateElement.
   * @constructor
   * @param {State} state - State that the StateElement belongs to.
   * @param {string} key - Selected key.
   * @param {StateElementOptions} opts - StateElement options.
   */
  constructor(state, key, opts) {
    this.#state = state;
    this.#key = key;
    this.#defaultValue = opts.defaultValue;
    this.#type = typeof opts.defaultValue;

    if (opts.config) {
      this.#config = { ...this.#config, ...opts.config };
    }

    if (this.#state.config.useLogs) {
      console.log("StateElement", {
        key: this.#key,
        defaultValue: this.#defaultValue,
        type: this.#type,
        config: this.#config,
      });
    }
  }

  /**
   * @returns {State}
   */
  get state() {
    return this.#state;
  }

  /**
   * @returns {string}
   */
  get key() {
    return this.#key;
  }

  /**
   * @returns {StorageValue}
   */
  get defaultValue() {
    return this.#defaultValue;
  }

  /**
   * @returns {StorageValueType}
   */
  get type() {
    return this.#type;
  }

  /**
   * @returns {StateElementConfig}
   */
  get config() {
    return this.#config;
  }

  /**
   * Get value for defined key from state.
   * @returns {StorageValue}
   */
  get() {
    return this.#state.get(this.#key);
  }

  /**
   * Set value for defined key to state.
   * @param {StorageValue} value - Value to be stored.
   */
  set(value) {
    if (typeof value !== this.#type) {
      throw new Error(`Expected value type "${this.#type}" but got "${typeof value}"`);
    }

    if (this.#config.onBeforeSet) {
      value = this.#config.onBeforeSet(value);
    }

    this.#state.set(this.#key, value, this.#config);
  }

  /**
   * Reset value to default value.
   */
  reset() {
    this.set(this.#defaultValue);
  }

  /**
   * Assign event listener for this StateElement.
   * @param {function(StorageValue): StateElement} listener - Event callback.
   * @returns {StateElement}
   */
  addListener(listener) {
    this.#state.addEventListener(this.#key, ({ detail }) => listener(detail));
    return this;
  }
}
