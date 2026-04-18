import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import Svg, { Rect, Line, Text as SvgText, Path, G } from 'react-native-svg';

interface FloorPlanSVGProps {
  widthFt: number;
  lengthFt: number;
}

const MCH_GREEN = '#4ade80';
const ROOM_FILL = '#111f16';
const GRID_STROKE = '#2d4a35';
const TICK_LEN = 10;

export default function FloorPlanSVG({ widthFt, lengthFt }: FloorPlanSVGProps) {
  const availableWidth = Dimensions.get('window').width - 48;

  // Scale so the longer side fills 85% of available width
  const longerSide = Math.max(widthFt, lengthFt, 1);
  const scale = (availableWidth * 0.85) / longerSide;

  const scaledW = widthFt * scale;
  const scaledH = lengthFt * scale;

  // Enforce minimum rendered size
  const roomW = Math.max(scaledW, 160);
  const roomH = Math.max(scaledH, 120);

  // Margins around the room for dimension lines + labels
  const marginLeft = 16;
  const marginTop = 16;
  const marginBottom = 44; // width dim line below
  const marginRight = 56; // length dim line on right

  const svgWidth = roomW + marginLeft + marginRight;
  const svgHeight = roomH + marginTop + marginBottom;

  // Room rect origin
  const rx = marginLeft;
  const ry = marginTop;

  // Build grid lines (every 2 ft, low opacity)
  const gridLines: React.ReactElement[] = [];
  const gridSpacingFt = 2;
  if (widthFt > 0 && lengthFt > 0) {
    for (let ft = gridSpacingFt; ft < widthFt; ft += gridSpacingFt) {
      const x = rx + (ft / widthFt) * roomW;
      gridLines.push(
        <Line
          key={`gv-${ft}`}
          x1={x}
          y1={ry}
          x2={x}
          y2={ry + roomH}
          stroke={GRID_STROKE}
          strokeWidth={0.5}
        />
      );
    }
    for (let ft = gridSpacingFt; ft < lengthFt; ft += gridSpacingFt) {
      const y = ry + (ft / lengthFt) * roomH;
      gridLines.push(
        <Line
          key={`gh-${ft}`}
          x1={rx}
          y1={y}
          x2={rx + roomW}
          y2={y}
          stroke={GRID_STROKE}
          strokeWidth={0.5}
        />
      );
    }
  }

  // Dimension line positions
  const widthDimY = ry + roomH + 22;
  const lengthDimX = rx + roomW + 22;

  // Width label: center below room
  const widthLabelX = rx + roomW / 2;
  const widthLabelY = widthDimY + 14;

  // Length label: rotated, right of room
  const lengthLabelX = lengthDimX + 14;
  const lengthLabelY = ry + roomH / 2;

  const wLabel = widthFt > 0 ? `${widthFt.toFixed(1)} ft` : '\u2014';
  const lLabel = lengthFt > 0 ? `${lengthFt.toFixed(1)} ft` : '\u2014';

  return (
    <View style={styles.wrapper}>
      <Svg width={svgWidth} height={svgHeight}>
        {/* Room fill (no stroke yet, so grid renders cleanly inside) */}
        <Rect x={rx} y={ry} width={roomW} height={roomH} fill={ROOM_FILL} />

        {/* Grid lines */}
        <G opacity={0.6}>{gridLines}</G>

        {/* Room border on top of grid */}
        <Rect
          x={rx}
          y={ry}
          width={roomW}
          height={roomH}
          fill="none"
          stroke={MCH_GREEN}
          strokeWidth={2}
        />

        {/* Corner tick marks — top-left */}
        <Path
          d={`M ${rx + TICK_LEN} ${ry} L ${rx} ${ry} L ${rx} ${ry + TICK_LEN}`}
          stroke={MCH_GREEN}
          strokeWidth={2}
          fill="none"
          strokeLinecap="round"
        />
        {/* top-right */}
        <Path
          d={`M ${rx + roomW - TICK_LEN} ${ry} L ${rx + roomW} ${ry} L ${rx + roomW} ${ry + TICK_LEN}`}
          stroke={MCH_GREEN}
          strokeWidth={2}
          fill="none"
          strokeLinecap="round"
        />
        {/* bottom-left */}
        <Path
          d={`M ${rx + TICK_LEN} ${ry + roomH} L ${rx} ${ry + roomH} L ${rx} ${ry + roomH - TICK_LEN}`}
          stroke={MCH_GREEN}
          strokeWidth={2}
          fill="none"
          strokeLinecap="round"
        />
        {/* bottom-right */}
        <Path
          d={`M ${rx + roomW - TICK_LEN} ${ry + roomH} L ${rx + roomW} ${ry + roomH} L ${rx + roomW} ${ry + roomH - TICK_LEN}`}
          stroke={MCH_GREEN}
          strokeWidth={2}
          fill="none"
          strokeLinecap="round"
        />

        {/* ── Width dimension line (bottom) ── */}
        <Line
          x1={rx}
          y1={widthDimY}
          x2={rx + roomW}
          y2={widthDimY}
          stroke={MCH_GREEN}
          strokeWidth={1}
          opacity={0.8}
        />
        {/* left tick */}
        <Line x1={rx} y1={widthDimY - 5} x2={rx} y2={widthDimY + 5} stroke={MCH_GREEN} strokeWidth={1} opacity={0.8} />
        {/* right tick */}
        <Line x1={rx + roomW} y1={widthDimY - 5} x2={rx + roomW} y2={widthDimY + 5} stroke={MCH_GREEN} strokeWidth={1} opacity={0.8} />
        {/* width label */}
        <SvgText
          x={widthLabelX}
          y={widthLabelY}
          textAnchor="middle"
          fontSize={13}
          fill={MCH_GREEN}
          fontWeight="600"
        >
          {wLabel}
        </SvgText>

        {/* ── Length dimension line (right side) ── */}
        <Line
          x1={lengthDimX}
          y1={ry}
          x2={lengthDimX}
          y2={ry + roomH}
          stroke={MCH_GREEN}
          strokeWidth={1}
          opacity={0.8}
        />
        {/* top tick */}
        <Line x1={lengthDimX - 5} y1={ry} x2={lengthDimX + 5} y2={ry} stroke={MCH_GREEN} strokeWidth={1} opacity={0.8} />
        {/* bottom tick */}
        <Line x1={lengthDimX - 5} y1={ry + roomH} x2={lengthDimX + 5} y2={ry + roomH} stroke={MCH_GREEN} strokeWidth={1} opacity={0.8} />
        {/* length label — rotated 90° */}
        <SvgText
          x={lengthLabelX}
          y={lengthLabelY}
          textAnchor="middle"
          fontSize={13}
          fill={MCH_GREEN}
          fontWeight="600"
          transform={`rotate(90, ${lengthLabelX}, ${lengthLabelY})`}
        >
          {lLabel}
        </SvgText>

        {/* ── Compass 'N' indicator (top-left inside room) ── */}
        <G opacity={0.45}>
          <Line
            x1={rx + 14}
            y1={ry + 22}
            x2={rx + 14}
            y2={ry + 10}
            stroke={MCH_GREEN}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
          {/* arrowhead */}
          <Path
            d={`M ${rx + 10} ${ry + 14} L ${rx + 14} ${ry + 10} L ${rx + 18} ${ry + 14}`}
            stroke={MCH_GREEN}
            strokeWidth={1.5}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <SvgText
            x={rx + 14}
            y={ry + 30}
            textAnchor="middle"
            fontSize={10}
            fill={MCH_GREEN}
            fontWeight="700"
          >
            N
          </SvgText>
        </G>
      </Svg>

      <Text style={styles.planLabel}>FLOOR PLAN</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'flex-start',
  },
  planLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6b7280',
    letterSpacing: 2,
    marginTop: 6,
    alignSelf: 'center',
  },
});
