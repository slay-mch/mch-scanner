import { NativeModule, requireOptionalNativeModule } from 'expo-modules-core';

declare class RoomPlanModuleType extends NativeModule {
  startScan(): void;
  addListener(eventName: string, listener: (event: any) => void): any;
  removeListeners(count: number): void;
}

const RoomPlanModule = requireOptionalNativeModule<RoomPlanModuleType>('RoomPlanModule');

export default RoomPlanModule;
export type RoomDimensions = {
  widthFt: number;
  lengthFt: number;
  heightFt: number;
};
