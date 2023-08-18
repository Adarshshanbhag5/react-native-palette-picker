import { NativeModules, Platform, Image } from 'react-native';
import type { Config, ImageColorsResult } from './NativePalettePicker';
import type { ImageRequireSource } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-palette-picker' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;

const PalettePickerModule = isTurboModuleEnabled
  ? require('./NativePalettePicker').default
  : NativeModules.PalettePicker;

const PalettePicker = PalettePickerModule
  ? PalettePickerModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export function getPalette(
  source: string | ImageRequireSource,
  config: Config = { fallback: '#000000', fallbackTextColor: '#ffffff' }
): Promise<ImageColorsResult> {
  if (typeof source === 'string') {
    const uri = source;
    return PalettePicker.getPalette(uri, config);
  } else {
    const uri = Image.resolveAssetSource(source).uri;
    return PalettePicker.getPalette(uri, config);
  }
}

export type { ImageColorsResult };
