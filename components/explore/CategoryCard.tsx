import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type CategoryCardProps = {
  name: string;
  imageUrl: string;
  onPress: () => void;
};

export const CategoryCard: React.FC<CategoryCardProps> = ({ name, imageUrl, onPress }) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      className="m-2 rounded-2xl overflow-hidden"
      style={{ height: 120, width: '100%' }}
    >
      <ImageBackground
        source={{ uri: imageUrl }}
        className="w-full h-full justify-center items-center"
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.5)']}
          className="absolute w-full h-full"
        />
        <Text className="text-white text-xl font-kaisei-bold z-10">
          {name}
        </Text>
      </ImageBackground>
    </TouchableOpacity>
  );
};