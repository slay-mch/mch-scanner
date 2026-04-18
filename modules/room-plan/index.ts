import { NativeModule, requireNativeModule, EventEmitter } from 'expo-modules-core';

declare class RoomPlanModuleType extends NativeModule {
  startScan(): void;
  addListener(eventName: string, listener: (event: any) => void): void;
  removeListeners(count: number): void;
}

const RoomPlanModule = requireNativeModule<RoomPlanModuleType>('RoomPlanModule');

export default RoomPlanModule;
export type RoomDimensions = {
  widthFt: number;
  lengthFt: number;
  heightFt: number;
};
