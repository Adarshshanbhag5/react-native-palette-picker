package com.palettepicker;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.net.Uri;
import android.util.Base64;
import android.webkit.URLUtil;

import androidx.annotation.NonNull;
import androidx.palette.graphics.Palette;

import com.facebook.react.bridge.ReadableMap;
import com.palettepicker.PalettePickerSpec;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URI;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class PalettePickerModule extends PalettePickerSpec {
  public static final String NAME = "PalettePicker";

  PalettePickerModule(ReactApplicationContext context) {
    super(context);
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }

  private static final Pattern HEX_PATTERN = Pattern.compile("^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$");

  private static String parseFallbackColor(String hex) {
    Matcher matcher = HEX_PATTERN.matcher(hex);

    if (!matcher.matches()) {
      throw new IllegalArgumentException("Invalid fallback hex color. Must be in the format #ffffff or #fff");
    }

    if (hex.length() == 7) {
      return hex;
    }

    return "#" + hex.charAt(1) + hex.charAt(1) + hex.charAt(2) + hex.charAt(2) + hex.charAt(3) + hex.charAt(3);
  }

  private static String getHex(int rgb) {
    return String.format("#%06X", 0xFFFFFF & rgb);
  }

  private void handleError(Promise promise, Exception e) {
    promise.reject("[color-palette]", e.getMessage(), e);
  }

  public WritableMap createPaletteAsync(Bitmap bitmap, int fallbackColorInt, String fallbackColor, String fallbackTextColor) {
    WritableMap colorPalette = Arguments.createMap();
    Palette.from(bitmap).generate(palette -> {
      if (palette != null) {
        Palette.Swatch dominant = palette.getDominantSwatch();
        if (dominant != null) {
          colorPalette.putString("dominant", getHex(dominant.getRgb()));
          colorPalette.putString("titleTextColor", getHex(dominant.getTitleTextColor()));
          colorPalette.putString("bodyTextColor", getHex(dominant.getBodyTextColor()));
        } else {
          colorPalette.putString("dominant", fallbackColor);
          colorPalette.putString("titleTextColor", fallbackTextColor);
          colorPalette.putString("bodyTextColor", fallbackTextColor);
        }
        colorPalette.putString("vibrant", getHex(palette.getVibrantColor(fallbackColorInt)));
        colorPalette.putString("darkVibrant", getHex(palette.getDarkVibrantColor(fallbackColorInt)));
        colorPalette.putString("lightVibrant", getHex(palette.getLightVibrantColor(fallbackColorInt)));
        colorPalette.putString("muted", getHex(palette.getMutedColor(fallbackColorInt)));
        colorPalette.putString("darkMuted", getHex(palette.getDarkMutedColor(fallbackColorInt)));
        colorPalette.putString("lightMuted", getHex(palette.getLightMutedColor(fallbackColorInt)));
      } else {
        colorPalette.putString("vibrant", fallbackColor);
        colorPalette.putString("darkVibrant", fallbackColor);
        colorPalette.putString("lightVibrant", fallbackColor);
        colorPalette.putString("muted", fallbackColor);
        colorPalette.putString("darkMuted", fallbackColor);
        colorPalette.putString("lightMuted", fallbackColor);
      }

    });

    return colorPalette;
  }


  @ReactMethod
  public void getPalette(ReadableMap resource, ReadableMap config, Promise promise) {
    try {
      String fallbackTextColor = config.getString("fallbackTextColor");
      String fallbackColor = parseFallbackColor(config.getString("fallback"));
      int fallbackColorInt = Color.parseColor(fallbackColor);

      //processing image uri
      Bitmap image = null;
      Context context = getReactApplicationContext();

      int resourceId = resource.getInt("resourceId");
      String uri = resource.getString("uri");

      // Check if local resource (required from react native)
      if (resourceId != 0) {
        image = BitmapFactory.decodeResource(context.getResources(), resourceId);
      }

      if (resourceId == 0 && uri != null) {
        // Check if base64
        if (uri.startsWith("data:image")) {
          String base64Uri = uri.split(",")[1];
          byte[] decodedBytes = Base64.decode(base64Uri, Base64.DEFAULT);

          image = BitmapFactory.decodeByteArray(decodedBytes, 0, decodedBytes.length);
        }

        //check if internal storage (requires appropriate permission)
        if (uri.startsWith("file://")) {
          String imgUri = Uri.parse(uri).getPath();
          image = BitmapFactory.decodeFile(imgUri);
        }

        // check if url (link)
        if (URLUtil.isValidUrl(uri)) {
          URI parsedUri = URI.create(uri);
          HttpURLConnection connection = (HttpURLConnection) parsedUri.toURL().openConnection();
          
          try (InputStream inputStream = connection.getInputStream()) {
            image = BitmapFactory.decodeStream(inputStream);
          }
        }
      }

      if (image == null) {
        throw new IOException("Failed to get image");
      } else {
        WritableMap colorPalette = createPaletteAsync(image, fallbackColorInt, fallbackColor, fallbackTextColor);
        promise.resolve(colorPalette);
      }
    } catch (Exception e) {
      handleError(promise, e);
    }
  }
}
