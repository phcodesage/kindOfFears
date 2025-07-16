import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { PhobiaCard } from '@/components/PhobiaCard';
import { SearchBar } from '@/components/SearchBar';
import { useTheme } from '@/contexts/ThemeContext';
import phobiasData from '@/data/phobias.json';

export default function PhobiasScreen() {
  const { colors } = useTheme();
  const { category } = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPhobias = phobiasData.filter(phobia => {
    const matchesCategory = category ? phobia.category === category : true;
    const matchesSearch = phobia.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         phobia.scientific.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handlePhobiaPress = (phobia: any) => {
    router.push(`/phobia/${phobia.id}`);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          {category ? 'Category Fears' : 'All Fears'}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {filteredPhobias.length} fears found
        </Text>
      </View>
      
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search fears..."
      />
      
      <FlatList
        data={filteredPhobias}
        renderItem={({ item, index }) => (
          <PhobiaCard
            phobia={item}
            onPress={() => handlePhobiaPress(item)}
            index={index}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    marginBottom: 20,
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
  list: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});