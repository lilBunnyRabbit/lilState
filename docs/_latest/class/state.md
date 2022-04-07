---
category: classes
---

# State

[EventTarget](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget)
{: .class-extends}  

Class representing main control unit for state management.
## Constructor

```js
new lilState.State(config, initElements);
```  
  
| Argument | Type                                    | Optional | Default | Description                |
| :------- | :-------------------------------------- | :------: | :------ | :------------------------- |
| config   | [StateConfig](../../types/state-config) |    ✔️     |         | [State](./) configuration. |
| config   | [StateConfig](./)                       |    ✔️     |         | [State](./) configuration. |
| config   | [StateConfig](./)                       |    ✔️     |         | [State](./) configuration. |
{: .argument-table}

## Properties

> elements
> 
> List of [StateElement](./)'s.  
> Tralala.
>
> void
{: .property-block }

## Methods

> setElement(<span class="arguments">a, b, c</span>)
> 
> List of [StateElement](./)'s.  
> Tralala.
> 
> | Argument | Type              | Optional | Default | Description |
> | :------- | :---------------- | :------: | :------ | :---------- |
> | a   | [StateConfig](./) | ✔️       |         | [State](./) configuration.|
> | b   | [StateConfig](./) | ✔️       |         | [State](./) configuration.|
> | c   | [StateConfig](./) | ✔️       |         | [State](./) configuration.|
> {: .argument-table}
>
> Map<string, [StateElement](./)>
{:.method-block}

## Example

```js
const example = (assert) => {
  const state = new State(
    {},
    {
      test: {
        defaultValue: 123,
      },
    }
  );

  const stateElement = state.attach("test");
  stateElement.set(456);
  stateElement.reset();
  assert.equal(stateElement.get(), 123);
}
```