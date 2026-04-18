import React from 'react';
import { requireNativeComponent, ViewStyle } from 'react-native';

interface Room3DViewProps {
  widthFt: number;
  lengthFt: number;
  heightFt: number;
  style?: ViewStyle;
}

const NativeRoom3DView = requireNativeComponent<Room3DViewProps>('MCHRoom3DView');

export default function Room3DView({ widthFt, lengthFt, heightFt, style }: Room3DViewProps) {
  return (
    <NativeRoom3DView
      widthFt={widthFt}
      lengthFt={lengthFt}
      heightFt={heightFt}
      style={style}
    />
  );
}
