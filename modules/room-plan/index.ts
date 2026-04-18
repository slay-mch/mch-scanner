import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

const { RoomPlanNative } = NativeModules;

export interface RoomDimensions {
  widthFt: number;
  lengthFt: number;
  heightFt: number;
}

let _emitter: NativeEventEmitter | null = null;

function getEmitter(): NativeEventEmitter | null {
  if (!RoomPlanNative) return null;
  if (!_emitter) _emitter = new NativeEventEmitter(RoomPlanNative);
  return _emitter;
}

const RoomPlanModule = RoomPlanNative
  ? {
      startScan: (): void => RoomPlanNative.startScan(),
      addListener: (event: string, callback: (data: any) => void): { remove: () => void } => {
        const emitter = getEmitter();
        if (!emitter) return { remove: () => {} };
        const sub = emitter.addListener(event, callback);
        return { remove: () => sub.remove() };
      },
    }
  : null;

export default RoomPlanModule;
