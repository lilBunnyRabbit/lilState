# [lilState](https://lilbunnyrabbit.github.io/lilstate/)
JavaScript library for state management.

## Installation
To install it either include the normal or minified script in your HTML file.

```html
<script src="https://lilbunnyrabbit.github.io/cdn/libs/lilstate/<version>/lilstate.js"></script>
```

```html
<script src="https://lilbunnyrabbit.github.io/cdn/libs/lilstate/<version>/lilstate.min.js"></script>
```

## Versions
* [0.0.0](https://lilbunnyrabbit.github.io/cdn/libs/lilstate/0.0.0/docs.html) - `latest`

## Example
```js
const { State, StateElement, StateComponent } = lilState;

const state = new State({
  useChangeEvent: true,
  useLogs: true,
});

// ...

const stateElement = state.init("clicks", {
  defaultValue: 0,
  config: {
    useLocalStorage: true,
    useEvents: true,
  },
});

// Increment "clicks" element in State.
document.getElementById("clicks-button").addEventListener("click", () => {
  stateElement.set(stateElement.get() + 1);
});

// ...

class App extends StateComponent {
  constructor() {
    super(state);
  }

  $onStateChange(key, value) {
    switch (key) {
      case "clicks":
        document.getElementById("clicks-display").innerText = `${value} clicks.`;
        break;
      default:
        break;
    }
  }
}
```
