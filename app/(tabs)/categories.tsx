import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@/contexts/ThemeContext';
import categoriesData from '@/data/categories.json';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function CategoriesScreen() {
  const { colors } = useTheme();

  const CategoryCard = ({ category, index }: { category: any; index: number }) => {
    const scale = useSharedValue(0);
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(50);

    React.useEffect(() => {
      const delay = index * 200;
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
      router.push(`/phobias?category=${category.id}`);
    };

    return (
      <AnimatedTouchable
        style={[styles.card, animatedStyle]}
        onPress={handlePress}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={[category.color, category.color + '80']}
          style={styles.cardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.cardIcon}>{category.icon}</Text>
          <Text style={styles.cardTitle}>{category.name}</Text>
          <Text style={styles.cardDescription}>{category.description}</Text>
          <Text style={styles.cardCount}>{category.count} fears</Text>
        </LinearGradient>
      </AnimatedTouchable>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Fear Categories</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Explore different types of fears
          </Text>
        </View>
        
        <View style={styles.grid}>
          {categoriesData.map((category, index) => (
            <CategoryCard key={category.id} category={category} index={index} />
          ))}
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
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  grid: {
    gap: 16,
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  cardGradient: {
    padding: 24,
    minHeight: 120,
  },
  cardIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
    marginBottom: 8,
  },
  cardCount: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.8,
    fontWeight: '500',
  },
});