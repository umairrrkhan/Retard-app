import React, { useRef, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Animated,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';
import { LinearGradient } from 'expo-linear-gradient';

// Enhanced Card Component
const EnhancedCard = ({
  imageUri,
  retardScore,
  imageAnim,
  scoreAnim,
  descAnim
}) => {
  const imageScale = imageAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1.2],
  });

  const rotateAnim = imageAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const getRetardQuote = (score) => {
    if (score < 30) return "Still smarter than a potato... barely";
    if (score < 60) return "Your brain has left the chat";
    if (score < 90) return "Achievement unlocked: Peak Retard";
    return "Congratulations! You've transcended intelligence!";
  };

  return (
    <LinearGradient 
      colors={['#F8F9FA', '#E9ECEF', '#DEE2E6']} 
      style={styles.enhancedCard}
    >
      <View style={styles.cardContent}>
        <Animated.View style={[styles.imageContainer, {
          transform: [
            { scale: imageScale },
            { rotate: rotateAnim }
          ]
        }]}>
          <Animated.Image
            source={{ uri: imageUri }}
            style={[styles.resultImage, { opacity: imageAnim }]}
          />
        </Animated.View>
        <View style={styles.metricsContainer}>
          <Animated.Text 
            style={[styles.resultScore, { 
              opacity: scoreAnim,
              transform: [{ scale: scoreAnim }]
            }]}
          >
            {retardScore}% RETARD
          </Animated.Text>
          <Animated.Text 
            style={[styles.resultDescription, { 
              opacity: descAnim,
              transform: [{ translateX: descAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-20, 0]
              })}]
            }]}
          >
            {getRetardQuote(retardScore)}
          </Animated.Text>
        </View>
      </View>
    </LinearGradient>
  );
};

// Main ResultScreen Component
export const ResultScreen = ({ route, navigation }) => {
  const { imageUri, retardScore } = route.params;
  const viewRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  // Animation values
  const imageAnim = useRef(new Animated.Value(0)).current;
  const scoreAnim = useRef(new Animated.Value(0)).current;
  const descAnim = useRef(new Animated.Value(0)).current;

  // Handle hardware back button press
  useEffect(() => {
    const backHandler = () => {
      navigation.navigate('Home');
      return true;
    };

    navigation.addListener('beforeRemove', (e) => {
      e.preventDefault();
      navigation.navigate('Home');
    });

    return () => {
      navigation.removeListener('beforeRemove');
    };
  }, [navigation]);

  // Start animations when component mounts with proper cleanup
  useEffect(() => {
    let isActive = true;
    const animation = Animated.sequence([
      Animated.timing(imageAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scoreAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(descAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]);

    animation.start(() => {
      if (isActive) {
        setIsReady(true);
      }
    });

    return () => {
      isActive = false;
      animation.stop();
      imageAnim.setValue(0);
      scoreAnim.setValue(0);
      descAnim.setValue(0);
    };
  }, []);

  const saveToGallery = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need media library permissions to save the image!');
        return;
      }

      const result = await captureRef(viewRef, {
        format: 'png',
        quality: 1,
      });

      await MediaLibrary.saveToLibraryAsync(result);
      alert('Result saved to gallery!');
    } catch (error) {
      console.error('Error saving result:', error);
      alert('Failed to save result. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View ref={viewRef} collapsable={false}>
          <EnhancedCard
            imageUri={imageUri}
            retardScore={retardScore}
            imageAnim={imageAnim}
            scoreAnim={scoreAnim}
            descAnim={descAnim}
          />
        </View>

        {isReady && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={saveToGallery}
            >
              <Text style={styles.buttonText}>Save Result</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.buttonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  enhancedCard: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    maxWidth: 500,
    alignSelf: 'center',
    width: '90%',
  },
  cardContent: {
    padding: 16,
    alignItems: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
  },
  resultImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    maxWidth: 300,
    maxHeight: 300,
  },
  metricsContainer: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 8,
  },
  resultScore: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    textAlign: 'center',
  },
  resultDescription: {
    fontSize: 16,
    color: '#495057',
    textAlign: 'center',
    paddingHorizontal: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 20,
    paddingHorizontal: 16,
    flexWrap: 'wrap',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 2,
    minWidth: 120,
    marginVertical: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});