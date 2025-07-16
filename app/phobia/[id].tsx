import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { ArrowLeft } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import phobiasData from '@/data/phobias.json';

export default function PhobiaDetailScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams();
  const phobia = phobiasData.find(p => p.id === id);

  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(-50);
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(50);

  React.useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 800 });
    headerTranslateY.value = withSpring(0);
    
    contentOpacity.value = withDelay(300, withTiming(1, { duration: 800 }));
    contentTranslateY.value = withDelay(300, withSpring(0));
  }, []);

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerTranslateY.value }],
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  if (!phobia) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>
          Phobia not found
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View style={[styles.header, headerAnimatedStyle]}>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: colors.surface }]}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          
          <LinearGradient
            colors={colors.gradient}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.icon}>{phobia.icon}</Text>
            <Text style={styles.name}>{phobia.name}</Text>
            <Text style={styles.scientific}>{phobia.scientific}</Text>
          </LinearGradient>
        </Animated.View>
        
        <Animated.View style={[styles.content, contentAnimatedStyle]}>
          <View style={[styles.section, { backgroundColor: colors.surface, shadowColor: colors.primary }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Definition
            </Text>
            <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
              {phobia.definition}
            </Text>
          </View>
          
          <View style={[styles.section, { backgroundColor: colors.surface, shadowColor: colors.primary }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Common Symptoms
            </Text>
            {phobia.symptoms.map((symptom, index) => (
              <Text key={index} style={[styles.listItem, { color: colors.textSecondary }]}>
                • {symptom}
              </Text>
            ))}
          </View>
          
          <View style={[styles.section, { backgroundColor: colors.surface, shadowColor: colors.primary }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Calming Tips
            </Text>
            {phobia.tips.map((tip, index) => (
              <Text key={index} style={[styles.listItem, { color: colors.textSecondary }]}>
                • {tip}
              </Text>
            ))}
          </View>
          
          <View style={[styles.supportSection, { backgroundColor: colors.accent + '20' }]}>
            <Text style={[styles.supportTitle, { color: colors.text }]}>
              Remember 💙
            </Text>
            <Text style={[styles.supportText, { color: colors.textSecondary }]}>
              Fears are common and treatable. If this fear significantly impacts your daily life, 
              consider speaking with a mental health professional. You're not alone in this journey.
            </Text>
          </View>
        </Animated.View>
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
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerGradient: {
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  icon: {
    fontSize: 48,
    marginBottom: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  scientific: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
    fontStyle: 'italic',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  section: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 24,
  },
  listItem: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  supportSection: {
    padding: 20,
    borderRadius: 16,
    marginTop: 8,
  },
  supportTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  supportText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
  },
});