import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { AnimatedButton } from '@/components/AnimatedButton';
import { useTheme } from '@/contexts/ThemeContext';

export default function ResultsScreen() {
  const { colors } = useTheme();
  const { score } = useLocalSearchParams();
  const totalScore = parseInt(score as string) || 0;

  const getResult = (score: number) => {
    if (score <= 3) {
      return {
        title: 'Brave Explorer! 🌟',
        message: 'You have a very low fear level. You approach new situations with confidence and curiosity.',
        color: '#4ECDC4',
        tips: [
          'Continue exploring new experiences',
          'Help others overcome their fears',
          'Share your confidence with friends',
        ],
      };
    } else if (score <= 7) {
      return {
        title: 'Cautious Adventurer 🛡️',
        message: 'You have a moderate fear level. You are careful but still willing to face challenges.',
        color: '#45B7D1',
        tips: [
          'Practice deep breathing exercises',
          'Take small steps towards your fears',
          'Remember that some caution is healthy',
        ],
      };
    } else if (score <= 11) {
      return {
        title: 'Sensitive Soul 🌸',
        message: 'You have a higher fear level. You are sensitive and intuitive about potential dangers.',
        color: '#F39C12',
        tips: [
          'Practice mindfulness and meditation',
          'Talk to trusted friends or family',
          'Consider gradual exposure to fears',
        ],
      };
    } else {
      return {
        title: 'Gentle Heart 💝',
        message: 'You have a high fear level. You are very sensitive and may benefit from additional support.',
        color: '#E74C3C',
        tips: [
          'Consider speaking with a counselor',
          'Practice relaxation techniques daily',
          'Remember that fears are treatable',
          'Take care of your mental health',
        ],
      };
    }
  };

  const result = getResult(totalScore);

  const titleOpacity = useSharedValue(0);
  const titleScale = useSharedValue(0.5);
  const messageOpacity = useSharedValue(0);
  const messageTranslateY = useSharedValue(50);
  const tipsOpacity = useSharedValue(0);
  const tipsTranslateY = useSharedValue(50);

  React.useEffect(() => {
    titleOpacity.value = withTiming(1, { duration: 800 });
    titleScale.value = withSpring(1);
    
    messageOpacity.value = withDelay(400, withTiming(1, { duration: 800 }));
    messageTranslateY.value = withDelay(400, withSpring(0));
    
    tipsOpacity.value = withDelay(800, withTiming(1, { duration: 800 }));
    tipsTranslateY.value = withDelay(800, withSpring(0));
  }, []);

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ scale: titleScale.value }],
  }));

  const messageAnimatedStyle = useAnimatedStyle(() => ({
    opacity: messageOpacity.value,
    transform: [{ translateY: messageTranslateY.value }],
  }));

  const tipsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: tipsOpacity.value,
    transform: [{ translateY: tipsTranslateY.value }],
  }));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Assessment Results</Text>
        </View>
        
        <Animated.View style={[styles.resultCard, titleAnimatedStyle]}>
          <LinearGradient
            colors={[result.color, result.color + '80']}
            style={styles.resultGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.resultTitle}>{result.title}</Text>
            <Text style={styles.scoreText}>Score: {totalScore}/15</Text>
          </LinearGradient>
        </Animated.View>
        
        <Animated.View style={[styles.messageCard, messageAnimatedStyle]}>
          <LinearGradient
            colors={[colors.surface, colors.surface]}
            style={[styles.messageGradient, { shadowColor: colors.primary }]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={[styles.messageText, { color: colors.text }]}>
              {result.message}
            </Text>
          </LinearGradient>
        </Animated.View>
        
        <Animated.View style={[styles.tipsCard, tipsAnimatedStyle]}>
          <LinearGradient
            colors={[colors.surface, colors.surface]}
            style={[styles.tipsGradient, { shadowColor: colors.primary }]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={[styles.tipsTitle, { color: colors.text }]}>
              Helpful Tips:
            </Text>
            {result.tips.map((tip, index) => (
              <Text key={index} style={[styles.tip, { color: colors.textSecondary }]}>
                • {tip}
              </Text>
            ))}
          </LinearGradient>
        </Animated.View>
        
        <View style={styles.buttonContainer}>
          <AnimatedButton
            title="Take Quiz Again"
            onPress={() => router.push('/quiz')}
            style={styles.button}
          />
          
          <AnimatedButton
            title="Explore Fears"
            onPress={() => router.push('/phobias')}
            style={styles.button}
            variant="secondary"
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
  },
  resultCard: {
    marginBottom: 20,
  },
  resultGradient: {
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  scoreText: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
  },
  messageCard: {
    marginBottom: 20,
  },
  messageGradient: {
    padding: 20,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  tipsCard: {
    marginBottom: 30,
  },
  tipsGradient: {
    padding: 20,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  tip: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  buttonContainer: {
    gap: 16,
  },
  button: {
    width: '100%',
  },
});