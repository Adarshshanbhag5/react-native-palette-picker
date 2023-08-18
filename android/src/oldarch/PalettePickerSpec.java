package com.palettepicker;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableMap;

abstract class PalettePickerSpec extends ReactContextBaseJavaModule {
  PalettePickerSpec(ReactApplicationContext context) {
    super(context);
  }

  public abstract void getPalette(String uri, ReadableMap config, Promise promise);
}
