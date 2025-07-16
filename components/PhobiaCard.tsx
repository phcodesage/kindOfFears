import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';

interface PhobiaCardProps {
  phobia: {
    id: string;
    name: string;
    scientific: string;
    definition: string;
    icon: string;
  };
  onPress: () => void;
  index: number;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const PhobiaCard: React.FC<PhobiaCardProps> = ({ phobia, onPress, index }) => {
  const { colors } = useTheme();
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);

  React.useEffect(() => {
    const delay = index * 100;
    scale.value = withDelay(delay, withSpring(1));
    opacity.value = withDelay(delay, withTiming(1, { duration: 600 }));
    translateY.value = withDelay(delay, withSpring(0));
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
    ],
    opacity: opacity.value,
  }));

  const handlePress = () => {
    scale.value = withSpring(0.95, {}, () => {
      scale.value = withSpring(1);
    });
    onPress();
  };

  return (
    <AnimatedTouchable
      style={[styles.container, animatedStyle]}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <LinearGradient
        colors={[colors.surface, colors.surface]}
        style={[styles.card, { shadowColor: colors.primary }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{phobia.icon}</Text>
        </View>
        <View style={styles.content}>
          <Text style={[styles.name, { color: colors.text }]}>{phobia.name}</Text>
          <Text style={[styles.scientific, { color: colors.textSecondary }]}>
            {phobia.scientific}
          </Text>
          <Text style={[styles.definition, { color: colors.textSecondary }]} numberOfLines={2}>
            {phobia.definition}
          </Text>
        </View>
      </LinearGradient>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  icon: {
    fontSize: 28,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  scientific: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  definition: {
    fontSize: 14,
    lineHeight: 20,
  },
});