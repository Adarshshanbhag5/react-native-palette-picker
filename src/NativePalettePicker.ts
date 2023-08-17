import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

/*
types
*/

export interface ImageColors {
  dominant: string;
  vibrant: string;
  darkVibrant: string;
  lightVibrant: string;
  darkMuted: string;
  lightMuted: string;
  muted: string;
  rgb: string;
  titleTextColor: string;
  bodyTextColor: string;
}

export interface Config {
  /**
   * @description Color used when getting color fails. Must be hex
   * @default '#000000'
   */
  fallback: string;
}

export interface imgResourceType {
  uri: string;
  resourceId: number;
}

export type ImageColorsResult = ImageColors;

export interface Spec extends TurboModule {
  getPalette(
    resource: imgResourceType,
    config: Config
  ): Promise<ImageColorsResult>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('PalettePicker');
