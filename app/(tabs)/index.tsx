import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { AnimatedButton } from '@/components/AnimatedButton';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useTheme } from '@/contexts/ThemeContext';

export default function HomeScreen() {
  const { colors } = useTheme();
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(50);
  const subtitleOpacity = useSharedValue(0);
  const subtitleTranslateY = useSharedValue(50);
  const buttonOpacity = useSharedValue(0);
  const buttonTranslateY = useSharedValue(50);

  React.useEffect(() => {
    titleOpacity.value = withTiming(1, { duration: 800 });
    titleTranslateY.value = withSpring(0);
    
    subtitleOpacity.value = withDelay(300, withTiming(1, { duration: 800 }));
    subtitleTranslateY.value = withDelay(300, withSpring(0));
    
    buttonOpacity.value = withDelay(600, withTiming(1, { duration: 800 }));
    buttonTranslateY.value = withDelay(600, withSpring(0));
  }, []);

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const subtitleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
    transform: [{ translateY: subtitleTranslateY.value }],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ translateY: buttonTranslateY.value }],
  }));

  return (
    <LinearGradient
      colors={colors.gradient}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <ThemeToggle />
        </View>
        
        <View style={styles.content}>
          <Animated.View style={[styles.titleContainer, titleAnimatedStyle]}>
            <Text style={styles.title}>Kinds of Fears</Text>
            <Text style={styles.emoji}>🧠✨</Text>
          </Animated.View>
          
          <Animated.View style={[styles.subtitleContainer, subtitleAnimatedStyle]}>
            <Text style={styles.subtitle}>
              Understanding fears helps us overcome them.{'\n'}
              Explore, learn, and find peace.
            </Text>
          </Animated.View>
          
          <Animated.View style={[styles.buttonContainer, buttonAnimatedStyle]}>
            <AnimatedButton
              title="Explore Fears"
              onPress={() => router.push('/categories')}
              style={styles.button}
            />
            
            <AnimatedButton
              title="Take Fear Quiz"
              onPress={() => router.push('/quiz')}
              style={styles.button}
              variant="secondary"
            />
          </Animated.View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
    paddingTop: 60,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 10,
  },
  emoji: {
    fontSize: 40,
  },
  subtitleContainer: {
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  button: {
    width: '100%',
  },
});