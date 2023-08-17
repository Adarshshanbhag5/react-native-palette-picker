
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNPalettePickerSpec.h"

@interface PalettePicker : NSObject <NativePalettePickerSpec>
#else
#import <React/RCTBridgeModule.h>

@interface PalettePicker : NSObject <RCTBridgeModule>
#endif

@end
