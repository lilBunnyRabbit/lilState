import StateElement from "./StateElement";

/**
 * Class representing main control unit for state management.
 * @extends EventTarget
 */
export default class State extends EventTarget {
  /**
   * State configuration.
   * @typedef {Object} StateConfig
   * @property {boolean} [useChangeEvent] - Dispatch "change" event when any element is updated.
   * @property {boolean} [useLogs] - Enable/disable logging.
   * @property {string} [prefix] - Local storage prefix.
   */

  /**
   * Type of stored values.
   * @typedef {(bigint | boolean | symbol | number | object | string)} StorageValue
   */

  /**
   * String type of StorageValue.
   * @typedef {("bigint" | "boolean" | "symbol" | "number" | "object" | "string")} StorageValueType
   */

  /**
   * State storage.
   * @private
   * @type {Map<string, StorageValue>}
   */
  #storage = new Map();

  /**
   * Initialized StateElement's.
   * @private
   * @type {Map<string, StateElement>}
   */
  #elements = new Map();

  /**
   * State configuration.
   * @private
   * @type {StateConfig}
   */
  #config = {
    useChangeEvent: false,
    useLogs: false,
    prefix: "",
  };

  /**
   * Create new State.
   * @constructor
   * @param {StateConfig} [config] - State configuration.
   * @param {Object.<string, StateElementOptions>} [initElements] - "List" of StateElement's to initialize.
   */
  constructor(config, initElements) {
    super();

    if (config) {
      this.#config = { ...this.#config, ...config };
    }

    if (this.#config.useLogs) {
      console.log("State", {
        config: this.#config,
      });
    }

    if (initElements) {
      Object.keys(initElements).forEach((key) => {
        const initElement = initElements[key];
        this.init(key, initElement);
      });
    }
  }

  /**
   * @returns {Map<string, StorageValue>}
   */
  get storage() {
    return this.#storage;
  }

  /**
   * @returns {Map<string, StateElement>}
   */
  get elements() {
    return this.#elements;
  }

  /**
   * @returns {StateConfig}
   */
  get config() {
    return this.#config;
  }

  /**
   * Prefix key with defined prefix.
   * @param {string} key - Selected key.
   * @returns {string}
   */
  #prefixKey(key) {
    if (!this.#config.prefix) return key;
    return `${this.#config.prefix}-${key}`;
  }

  /**
   * Set value for selected key.
   * @param {string} key - Selected key.
   * @param {StorageValue} value - Value to be stored.
   * @param {StateElementConfig} config - StateElement configuration.
   */
  set(key, value, config) {
    this.#storage.set(key, value);

    if (config.useLocalStorage) {
      localStorage.setItem(this.#prefixKey(key), this.#valueToString(value));
    }

    if (config.useEvents) {
      this.dispatchEvent(new CustomEvent(key, { detail: value }));

      if (this.#config.useChangeEvent) {
        this.dispatchEvent(new CustomEvent("change", { detail: { key, value } }));
      }
    }
  }

  /**
   * Get stored value for selected key.
   * @param {string} key - Selected key.
   * @returns {StorageValue}
   */
  get(key) {
    return this.#storage.get(key);
  }

  /**
   * Convert value to string.
   * @private
   * @param {StorageValue} value
   * @returns {string}
   * @throws {Error}
   */
  #valueToString(value) {
    switch (typeof value) {
      case "bigint":
      case "boolean":
      case "symbol":
      case "number":
        return value.toString();
      case "object":
        return JSON.stringify(value);
      case "string":
        return value;
      case "undefined":
      case "function":
      default:
        throw new Error(`Value type "${typeof value}" is not supported`);
    }
  }

  /**
   * Convert string to value.
   * @private
   * @param {string} value
   * @param {StorageValueType} type - value type.
   * @returns {StorageValue}
   * @throws {Error}
   */
  #valueFromString(value, type) {
    switch (type) {
      case "bigint":
        return BigInt(value);
      case "boolean":
        return Boolean(value);
      case "symbol":
        return Symbol(value);
      case "number":
        return Number.parseFloat(value);
      case "object":
        return JSON.parse(value);
      case "string":
        return value;
      case "undefined":
      case "function":
      default:
        throw new Error(`Value type "${typeof value}" is not supported`);
    }
  }

  /**
   * Initialize new StateElement.
   * @param {string} key - Unique key.
   * @param {StateElementOptions} opts - StateElement options.
   * @returns {StateElement}
   * @throws {Error}
   */
  init(key, opts) {
    if (this.#elements.get(key)) {
      throw new Error("Element already initialized");
    }

    const type = typeof opts.defaultValue;
    if (type === "function" || type === "undefined") {
      throw new Error(`Value type "${type}" is not supported`);
    }

    let value = opts.defaultValue;
    if (opts.config?.useLocalStorage) {
      const localValue = localStorage.getItem(this.#prefixKey(key));
      if (localValue !== null) {
        value = this.#valueFromString(localValue, type);
      }
    }

    this.set(key, value, { ...opts.config, useEvents: false });

    const element = new StateElement(this, key, opts);
    this.#elements.set(key, element);

    return element;
  }

  /**
   * Attach to initialized StateElement.
   * @param {string} key - Selected key.
   * @returns {StateElement}
   * @throws {Error}
   */
  attach(key) {
    const element = this.#elements.get(key);
    if (!element) {
      throw new Error("Element not initialized");
    }

    return element;
  }
}
