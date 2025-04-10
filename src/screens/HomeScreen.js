import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';

export const HomeScreen = ({ navigation }) => {
  const titleAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(titleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true
      }),
      Animated.timing(buttonAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true
      })
    ]).start();
  }, []);
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        navigation.navigate('Analysis', { imageUri: result.assets[0].uri });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      alert('Failed to pick image. Please try again.');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera permissions to make this work!');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        navigation.navigate('Analysis', { imageUri: result.assets[0].uri });
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      alert('Failed to take photo. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.pixelBorder}>
        <Animated.Text 
          style={[styles.title, {
            opacity: titleAnim,
            transform: [{
              scale: titleAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.5, 1]
              })
            }]
          }]}
        >
          Retard Level Analyzer
        </Animated.Text>
      </View>
      
      <Animated.View 
        style={[styles.buttonContainer, {
          opacity: buttonAnim,
          transform: [{
            translateY: buttonAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0]
            })
          }]
        }]}
      >
        <TouchableOpacity 
          style={styles.button} 
          onPress={pickImage}
          activeOpacity={0.7}
        >
          <View style={styles.buttonInner}>
            <Text style={styles.buttonText}>Select Photo</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button} 
          onPress={takePhoto}
          activeOpacity={0.7}
        >
          <View style={styles.buttonInner}>
            <Text style={styles.buttonText}>Take Photo</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.pixelCorner1} />
      <View style={styles.pixelCorner2} />
      <View style={styles.pixelCorner3} />
      <View style={styles.pixelCorner4} />
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: width * 0.05,
  },
  pixelBorder: {
    padding: width * 0.03,
    backgroundColor: '#F8F9FA',
    borderWidth: 2,
    borderColor: '#E9ECEF',
    marginBottom: height * 0.05,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: Math.min(width * 0.08, 32),
    fontWeight: 'bold',
    color: '#212529',
    textShadowColor: '#E9ECEF',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: width * 0.03,
    width: '100%',
    maxWidth: width * 0.9,
  },
  button: {
    flex: 1,
    minWidth: width * 0.35,
    maxWidth: width * 0.4,
    aspectRatio: 1.618,
    padding: 3,
    backgroundColor: '#007BFF',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2.22,
  },
  buttonInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#007BFF',
    borderRadius: 6,
  },
  buttonText: {
    color: '#007BFF',
    fontSize: Math.min(width * 0.04, 18),
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  pixelCorner1: {
    position: 'absolute',
    top: height * 0.02,
    left: width * 0.05,
    width: width * 0.03,
    height: width * 0.03,
    backgroundColor: '#3498DB',
    borderRadius: 4,
  },
  pixelCorner2: {
    position: 'absolute',
    top: height * 0.02,
    right: width * 0.05,
    width: width * 0.03,
    height: width * 0.03,
    backgroundColor: '#3498DB',
    borderRadius: 4,
  },
  pixelCorner3: {
    position: 'absolute',
    bottom: height * 0.02,
    left: width * 0.05,
    width: width * 0.03,
    height: width * 0.03,
    backgroundColor: '#3498DB',
    borderRadius: 4,
  },
  pixelCorner4: {
    position: 'absolute',
    bottom: height * 0.02,
    right: width * 0.05,
    width: width * 0.03,
    height: width * 0.03,
    backgroundColor: '#3498DB',
    borderRadius: 4,
  },
});