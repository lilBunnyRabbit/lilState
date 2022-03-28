---
layout: doc
category: class
---

# State

EventTarget
{: .class-extends}  

Class representing main control unit for state management.

## Constructor

```js
new lilState.State(config, initElements);
```  
  
| Argument | Type              | Optional | Default | Description                |
| :------- | :---------------- | :------: | :------ | :------------------------- |
| config   | [StateConfig](./) |    ✔️     |         | [State](./) configuration. |
| config   | [StateConfig](./) |    ✔️     |         | [State](./) configuration. |
| config   | [StateConfig](./) |    ✔️     |         | [State](./) configuration. |
{: .argument-table}

## Properties

> .elements
> 
> List of [StateElement](./)'s.  
> Tralala.
>
> Returns void.

> .elements
> 
> List of [StateElement](./)'s.  
> Tralala.
> 
> | Argument | Type              | Optional | Default | Description |
> | :------- | :---------------- | :------: | :------ | :---------- |
> | config   | [StateConfig](./) | ✔️       |         | [State](./) configuration.|
> | config   | [StateConfig](./) | ✔️       |         | [State](./) configuration.|
> | config   | [StateConfig](./) | ✔️       |         | [State](./) configuration.|
> {: .argument-table}
>
> Returns void.

## Methods

> .set(key, value)
> 
> List of [StateElement](./)'s.  
> Tralala.
>
> Returns void.

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