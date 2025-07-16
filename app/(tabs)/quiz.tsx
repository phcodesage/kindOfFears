import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { AnimatedButton } from '@/components/AnimatedButton';
import { useTheme } from '@/contexts/ThemeContext';
import quizData from '@/data/quiz.json';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function QuizScreen() {
  const { colors } = useTheme();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const cardRotation = useSharedValue(0);
  const cardOpacity = useSharedValue(1);
  const progressWidth = useSharedValue(0);

  React.useEffect(() => {
    const progress = ((currentQuestion + 1) / quizData.questions.length) * 100;
    progressWidth.value = withTiming(progress, { duration: 300 });
  }, [currentQuestion]);

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${cardRotation.value}deg` }],
    opacity: cardOpacity.value,
  }));

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const handleAnswer = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    
    setTimeout(() => {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = quizData.questions[currentQuestion].options[optionIndex].score;
      setAnswers(newAnswers);
      
      if (currentQuestion < quizData.questions.length - 1) {
        cardRotation.value = withSpring(180, {}, () => {
          cardRotation.value = withSpring(0);
        });
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
      } else {
        // Quiz completed
        const totalScore = newAnswers.reduce((sum, score) => sum + score, 0);
        router.push(`/results?score=${totalScore}`);
      }
    }, 300);
  };

  const question = quizData.questions[currentQuestion];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Fear Assessment</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Question {currentQuestion + 1} of {quizData.questions.length}
          </Text>
        </View>
        
        <View style={[styles.progressContainer, { backgroundColor: colors.surface }]}>
          <Animated.View 
            style={[
              styles.progressBar,
              progressAnimatedStyle,
              { backgroundColor: colors.primary }
            ]}
          />
        </View>
        
        <Animated.View style={[styles.card, cardAnimatedStyle]}>
          <LinearGradient
            colors={[colors.surface, colors.surface]}
            style={[styles.cardGradient, { shadowColor: colors.primary }]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={[styles.question, { color: colors.text }]}>
              {question.question}
            </Text>
            
            <View style={styles.options}>
              {question.options.map((option, index) => (
                <AnimatedTouchable
                  key={index}
                  style={[
                    styles.option,
                    {
                      backgroundColor: selectedOption === index ? colors.primary : colors.background,
                      shadowColor: colors.primary,
                    }
                  ]}
                  onPress={() => handleAnswer(index)}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.optionText,
                    { color: selectedOption === index ? '#ffffff' : colors.text }
                  ]}>
                    {option.text}
                  </Text>
                </AnimatedTouchable>
              ))}
            </View>
          </LinearGradient>
        </Animated.View>
        
        {currentQuestion > 0 && (
          <AnimatedButton
            title="Previous Question"
            onPress={() => {
              setCurrentQuestion(currentQuestion - 1);
              setSelectedOption(null);
            }}
            style={styles.prevButton}
            variant="secondary"
          />
        )}
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
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  progressContainer: {
    height: 4,
    borderRadius: 2,
    marginBottom: 30,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  card: {
    marginBottom: 30,
  },
  cardGradient: {
    padding: 24,
    borderRadius: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  question: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  options: {
    gap: 12,
  },
  option: {
    padding: 16,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  optionText: {
    fontSize: 16,
    textAlign: 'center',
  },
  prevButton: {
    marginTop: 20,
  },
});