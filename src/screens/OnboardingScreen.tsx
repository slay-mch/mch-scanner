import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: SCREEN_W } = Dimensions.get('window');

interface Slide {
  icon: string;
  title: string;
  body: string;
}

const SLIDES: Slide[] = [
  {
    icon: '📷',
    title: 'Point & Walk',
    body: 'Walk around your room while pointing your camera at walls, floor, and ceiling.',
  },
  {
    icon: '⏱',
    title: '~60 Seconds',
    body: 'The scan takes about a minute. A live floor plan builds as you move.',
  },
  {
    icon: '✅',
    title: 'Auto-Fill Your Quiz',
    body: 'When you\'re done, your room dimensions go straight into your MCH build quiz.',
  },
];

interface OnboardingScreenProps {
  onFinish: () => void;
}

export default function OnboardingScreen({ onFinish }: OnboardingScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const goNext = async () => {
    if (currentIndex < SLIDES.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      scrollRef.current?.scrollTo({ x: nextIndex * SCREEN_W, animated: true });
    } else {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      onFinish();
    }
  };

  const isLast = currentIndex === SLIDES.length - 1;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        style={styles.slider}
      >
        {SLIDES.map((slide, idx) => (
          <View key={idx} style={styles.slide}>
            <Text style={styles.slideIcon}>{slide.icon}</Text>
            <Text style={styles.slideTitle}>{slide.title}</Text>
            <Text style={styles.slideBody}>{slide.body}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Progress dots */}
      <View style={styles.dots}>
        {SLIDES.map((_, idx) => (
          <View
            key={idx}
            style={[styles.dot, currentIndex === idx && styles.dotActive]}
          />
        ))}
      </View>

      {/* CTA */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={goNext}>
          <Text style={styles.buttonText}>
            {isLast ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f3d2a',
  },
  slider: {
    flex: 1,
  },
  slide: {
    width: SCREEN_W,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  slideIcon: {
    fontSize: 80,
    marginBottom: 32,
  },
  slideTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 0.3,
  },
  slideBody: {
    fontSize: 17,
    color: 'rgba(255,255,255,0.80)',
    textAlign: 'center',
    lineHeight: 26,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.30)',
  },
  dotActive: {
    backgroundColor: '#ffffff',
    width: 20,
  },
  footer: {
    paddingHorizontal: 32,
    paddingBottom: 40,
  },
  button: {
    backgroundColor: '#2d7a4f',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.3,
  },
});
