# React-Input-Multiline

A text input for [React](https://reactjs.com), based on contenteditable div. It has `inline` display property, can span accross multiple lines and is dependant on the parent container dimensions.

# Installation and usage

install using package managers.

```

# With npm
npm i react-input-multiline

# With Yarn

yarn add react-input-multiline
```

And use it in your app:

#### With React Class Component

```js
import React from 'react';
import { MultilineInput } from 'react-input-multiline';

class App extends React.Component {
  state = {
    inputValue: '',
  };
  handleChange = (e) => {
    this.setState({ value: e.target.value }, () =>
      console.log(`Typing:`, this.state.inputValue)
    );
  };
  render() {
    const { inputValue } = this.state;

    return (
      <div className="App">
        <MultilineInput
          value={inputValue}
          id="someId"
          onChange={this.handleChange}
        />
      </div>
    );
  }
}
```

#### With React Hooks

```js
import React, { useState } from 'react';
import { MultilineInput } from 'react-input-multiline';

export default function App() {
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="App">
      <MultilineInput
        value={inputValue}
        id="someId"
        onChange={(e) => setInputValue(e.target.value)}
      />
    </div>
  );
}
```

## Props

The available props aren:

| Prop                | Description                                             | Type                                                                      |
| ------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------- |
| `id`                | value for the id selector and the DOM event.target.name | `string`                                                                  |
| `onChange`          | subscribe to change events                              | `function`                                                                |
| `value`             | control the current value                               | `string`                                                                  |
| `style`             | style the component with inline styling                 | [`React.CSSProperties`](https://reactjs.org/docs/dom-elements.html#style) |
| `additionalClasses` | add additional style classes                            | `string[]`                                                                |
| `placeholder`       | text placeholder when the value is empty                | `string`                                                                  |
| `disabled`          | disable the edit functionality                          | `boolean`                                                                 |
| `preventLineBreaks` | prevent line breaks on keyboard and paste events        | `boolean`                                                                 |

## License

MIT Licensed. Copyright (c) Giedrius Rudzianskas 2021.
