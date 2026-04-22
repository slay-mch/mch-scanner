#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import <UIKit/UIKit.h>
#import <AVFoundation/AVFoundation.h>

#if __has_include(<RoomPlanNative/RoomPlanNative-Swift.h>)
#import <RoomPlanNative/RoomPlanNative-Swift.h>
#else
#import "RoomPlanNative-Swift.h"
#endif

@interface RoomPlanNative : RCTEventEmitter <RCTBridgeModule, RoomPlanDelegate>
@end

@implementation RoomPlanNative

RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents {
  return @[@"onScanComplete", @"onScanError"];
}

RCT_EXPORT_METHOD(startScan) {
  dispatch_async(dispatch_get_main_queue(), ^{
    AVAuthorizationStatus status = [AVCaptureDevice authorizationStatusForMediaType:AVMediaTypeVideo];

    if (status == AVAuthorizationStatusAuthorized) {
      [self presentScannerVC];
    } else if (status == AVAuthorizationStatusNotDetermined) {
      [AVCaptureDevice requestAccessForMediaType:AVMediaTypeVideo completionHandler:^(BOOL granted) {
        dispatch_async(dispatch_get_main_queue(), ^{
          if (granted) {
            [self presentScannerVC];
          } else {
            [self sendEventWithName:@"onScanError" body:@{@"message": @"camera_denied"}];
          }
        });
      }];
    } else {
      // Denied or restricted
      [self sendEventWithName:@"onScanError" body:@{@"message": @"camera_denied"}];
    }
  });
}

- (void)presentScannerVC {
  UIWindowScene *scene = nil;
  for (UIScene *s in [UIApplication sharedApplication].connectedScenes) {
    if ([s isKindOfClass:[UIWindowScene class]]) {
      scene = (UIWindowScene *)s;
      break;
    }
  }

  UIViewController *rootVC = scene.windows.firstObject.rootViewController;
  if (!rootVC) {
    [self sendEventWithName:@"onScanError" body:@{@"message": @"No root view controller"}];
    return;
  }

  MCHRoomScannerViewController *scannerVC = [[MCHRoomScannerViewController alloc] init];
  scannerVC.delegate = self;
  scannerVC.modalPresentationStyle = UIModalPresentationFullScreen;
  [rootVC presentViewController:scannerVC animated:YES completion:nil];
}

// MARK: - RoomPlanDelegate

- (void)didCompleteWithWidth:(double)widthFt length:(double)lengthFt height:(double)heightFt usdzPath:(NSString * _Nullable)usdzPath {
  NSMutableDictionary *body = [@{
    @"widthFt": @(widthFt),
    @"lengthFt": @(lengthFt),
    @"heightFt": @(heightFt),
  } mutableCopy];
  if (usdzPath) body[@"usdzPath"] = usdzPath;
  [self sendEventWithName:@"onScanComplete" body:body];
}

- (void)didFailWithError:(NSString *)message {
  [self sendEventWithName:@"onScanError" body:@{@"message": message}];
}

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

@end
