import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Sun, Moon } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme, colors } = useTheme();
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}deg` },
      { scale: scale.value },
    ],
  }));

  const handlePress = () => {
    rotation.value = withSpring(rotation.value + 180);
    scale.value = withSpring(0.8, {}, () => {
      scale.value = withSpring(1);
    });
    toggleTheme();
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.surface, shadowColor: colors.primary }]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Animated.View style={animatedStyle}>
        {theme === 'light' ? (
          <Sun size={24} color={colors.text} />
        ) : (
          <Moon size={24} color={colors.text} />
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
});