#import <React/RCTViewManager.h>
#import <UIKit/UIKit.h>

#if __has_include(<RoomPlanNative/RoomPlanNative-Swift.h>)
#import <RoomPlanNative/RoomPlanNative-Swift.h>
#else
#import "RoomPlanNative-Swift.h"
#endif

@interface MCHRoom3DViewManager : RCTViewManager
@end

@implementation MCHRoom3DViewManager

RCT_EXPORT_MODULE(MCHRoom3DView)

- (UIView *)view {
  return [[MCHRoom3DView alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(widthFt, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(lengthFt, CGFloat)
RCT_EXPORT_VIEW_PROPERTY(heightFt, CGFloat)

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

@end
