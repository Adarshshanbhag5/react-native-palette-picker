# react-native-palette-picker

Android [Color-palette API](https://developer.android.com/reference/androidx/palette/graphics/Palette) implementation for React Native Apps

<p align="center" >
  <img
    width="250px"
    src="https://github.com/Adarshshanbhag5/react-native-palette-picker/raw/main/screenshots/screenshot_MusicFumes.jpg"
    alt="Example 1 musicFumes"
  />
  <img
    width="250px"
    src="https://github.com/Adarshshanbhag5/react-native-palette-picker/raw/main/screenshots/screenshot_1.jpg"
    alt="Demo 1 Android"
  />
  <img
    width="250px"
    src="https://github.com/Adarshshanbhag5/react-native-palette-picker/raw/main/screenshots/screenshot_2.jpg"
    alt="Demo 2 Android"
  />
</p>

## Installation

- [React Native CLI](#react-native-cli)
- Install this package using `npm` or `yarn`

with `npm`:

```sh
npm install react-native-palette-picker
```

with `yarn`:

```sh
yarn add react-native-palette-picker
```

## Usage

```js
import React from 'react'
import { getPalette, type ImageColorsResult} from 'react-native-palette-picker';

const useImageColors = () => {
  const [colors, setColors] = React.useState<ImageColorsResult>(null);
  const [err, setErr] = React.useState<unknown>();

   React.useEffect(() => {
    const imgUri = "https://i.imgur.com/RCRf1Sx.jpeg";
    (async () => {
      try {
        const res = await getPalette(imgUri, {
          fallback: '#ff0000',
          fallbackTextColor: '#ffffff',
        });
        setColors(res);
      } catch (error) {
        setErr(error);
      }
    })();
  }, []);

  return colors
}
```

## API

#### `getPalette(source: string | number, config?: Config): Promise<ImageColorsResult>`

#### `uri`

A string which can be:

- URL:

  [`https://i.imgur.com/RCRf1Sx.jpeg`](https://i.imgur.com/RCRf1Sx.jpeg)

- Local file:

  ```js
  const img = require('../assets/img.jpg');
  ```

- Base64:

  ```js
  const base64 = 'data:image/jpeg;base64,/9j/4Ri...';
  ```

  > The mime type prefix for base64 is required (e.g. data:image/png;base64).

#### `Config?`

The config object is optional.

| Property            | Description                                                                          | Type     | Default   |
| ------------------- | ------------------------------------------------------------------------------------ | -------- | --------- |
| `fallback`          | If a color property couldn't be retrieved, it will default to this hex color string  | `string` | "#000000" |
| `fallbackTextColor` | Text color used when getting color fails.(titleTextColor,bodyTextColor). Must be hex | `string` | "#FFFFFF" |

#### `ImageColorsResult`

| Property         | Type     |
| ---------------- | -------- |
| `dominant`       | `string` |
| `vibrant`        | `string` |
| `darkVibrant`    | `string` |
| `lightVibrant`   | `string` |
| `darkMuted`      | `string` |
| `lightMuted`     | `string` |
| `muted`          | `string` |
| `titleTextColor` | `string` |
| `bodyTextColor`  | `string` |

---

### Notes

- There is an [example](https://github.com/Adarshshanbhag5/react-native-palette-picker/blob/main/example/src/App.tsx) app.

## Future work

- [ ] iOS support (need ios dev)

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

If you are experienced with iOS development and would like to contribute, please feel free to submit pull requests or open issues related to iOS support. Your contributions will be greatly appreciated and will help make this library more versatile.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
