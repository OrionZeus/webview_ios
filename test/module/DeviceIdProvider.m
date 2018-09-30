//
//  DeviceIdProvider.m
//  WebViewPro
//
//  Created by Apple on 2018/9/28.
//  Copyright © 2018年 kupay. All rights reserved.
//

#import "DeviceIdProvider.h"

@implementation DeviceIdProvider
- (void)getUUId:(NSArray *)array{
    NSNumber *callbackId = [array objectAtIndex:0];
    NSString *UUIDString = [[[UIDevice currentDevice] identifierForVendor] UUIDString];
    [JSBundle callJS:callbackId code:0 params:[NSArray arrayWithObjects:UUIDString,nil]];
}
@end
