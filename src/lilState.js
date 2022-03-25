import State from "./core/State";
import StateComponent from "./core/StateComponent";
import StateElement from "./core/StateElement";

/**
 * @author lilBunnyRabbit
 */

/**
 * @typedef {Object} lilState
 * @property {State} State
 * @property {StateElement} StateElement
 * @property {StateComponent} StateComponent
 */

/**
 * Assigns objects to window.
 * @type {lilState}
 */
window.lilState = {
  State,
  StateElement,
  StateComponent,
};
