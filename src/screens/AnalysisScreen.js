import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, Animated, Dimensions, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as FaceDetector from 'expo-face-detector';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

export const AnalysisScreen = ({ route, navigation }) => {
  const { imageUri } = route.params;
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [progress, setProgress] = useState(0);

  // Animation values
  const textOpacity = useRef(new Animated.Value(0)).current;
  const spinValue = useRef(new Animated.Value(0)).current;
  const progressValue = useRef(new Animated.Value(0)).current;
  const shakeValue = useRef(new Animated.Value(0)).current; // For earthquake effect

  // Screen dimensions for ball movement
  const { width, height } = Dimensions.get('window');
  const ballColors = [
    '#FF4081', // Pink
    '#FF5722', // Deep Orange
    '#FFC107', // Amber
    '#8BC34A', // Light Green
    '#03A9F4', // Light Blue
    '#9C27B0', // Purple
  ];
  
  const balls = Array.from({ length: 12 }, () => ({
    position: new Animated.ValueXY({ x: Math.random() * width, y: Math.random() * height }),
    scale: new Animated.Value(Math.random() * 0.5 + 0.5),
    opacity: new Animated.Value(Math.random() * 0.5 + 0.5),
    // Add random colors for more aesthetics
    color: ballColors[Math.floor(Math.random() * ballColors.length)],
  }));

  // Hilarious messages
  const messages = [
    "Scanning your dumbass brain...",
    "Checking if you've got any fuckin' sense...",
    "Measuring your epic fail potential...",
    "Calibrating the shit-o-meter...",
    "Asking the meme gods what's wrong with you...",
    "Decoding your special kind of stupid...",
  ];

  // Face detection function with enhanced error handling
  const detectFaces = async (uri) => {
    try {
      const manipResult = await manipulateAsync(
        uri,
        [{ resize: { width: 800 } }], // Optimize image size
        { compress: 0.8, format: SaveFormat.JPEG }
      );
      const options = {
        mode: FaceDetector.FaceDetectorMode.accurate,
        detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
        runClassifications: FaceDetector.FaceDetectorClassifications.all,
        minDetectionInterval: 100,
        tracking: true,
      };
      const { faces } = await FaceDetector.detectFacesAsync(manipResult.uri, options);
      if (faces.length === 0) {
        throw new Error('No faces detected');
      }
      return true;
    } catch (error) {
      console.error('Error detecting faces:', error);
      throw error; // Propagate error for proper handling
    }
  };

  // Analysis function
  const analyzeImage = async () => {
    try {
      const startTime = Date.now();
      const hasFace = await detectFaces(imageUri);
      const elapsedTime = Date.now() - startTime;
      const minimumAnimationTime = 5000; // 5 seconds

      // Ensure at least 5 seconds of animation
      if (elapsedTime < minimumAnimationTime) {
        await new Promise((resolve) => setTimeout(resolve, minimumAnimationTime - elapsedTime));
      }

      if (!hasFace) {
        alert('No face detected! Please upload an image with a human face.');
        navigation.navigate('HomeTab');
        return;
      }

      setAnalysisComplete(true);

      // Calculate the "retard score"
      const baseScore = Math.floor(Math.random() * 60);
      const faceBonus = Math.floor(Math.random() * 20);
      const randomFactor = Math.floor(Math.random() * 20);
      const finalScore = Math.min(100, baseScore + faceBonus + randomFactor);

      // Navigate immediately to result screen
      navigation.navigate('Result', {
        imageUri,
        retardScore: finalScore,
        hasFace: true,
      });
    } catch (error) {
      console.error('Error analyzing image:', error);
      alert('Error analyzing image. Please try again.');
      navigation.navigate('HomeTab');
    }
  };

  // Start analysis and animations
  useEffect(() => {
    if (isAnalyzing) {
      let isActive = true;
      analyzeImage();

      // Smooth progress counter animation
      const progressAnimation = Animated.timing(progressValue, {
        toValue: 100,
        duration: 5000,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      });

      // Update progress counter with proper cleanup
      const progressListener = progressValue.addListener(({ value }) => {
        if (isActive) {
          setProgress(Math.floor(value));
        }
      });

      // Fade in text with proper cleanup
      const textAnimation = Animated.timing(textOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      });

      progressAnimation.start();
      textAnimation.start();
      
      // Add earthquake shaking effect for the progress text with proper cleanup
      const shakeAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(shakeValue, {
            toValue: 1,
            duration: 100,
            easing: Easing.bounce,
            useNativeDriver: true,
          }),
          Animated.timing(shakeValue, {
            toValue: -1,
            duration: 100,
            easing: Easing.bounce,
            useNativeDriver: true,
          }),
          Animated.timing(shakeValue, {
            toValue: 0.5,
            duration: 100,
            easing: Easing.bounce,
            useNativeDriver: true,
          }),
          Animated.timing(shakeValue, {
            toValue: -0.5,
            duration: 100,
            easing: Easing.bounce,
            useNativeDriver: true,
          }),
          Animated.timing(shakeValue, {
            toValue: 0,
            duration: 100,
            easing: Easing.bounce,
            useNativeDriver: true,
          }),
          Animated.delay(1000),
        ])
      );
      
      shakeAnimation.start();

      // Start spinner animation with proper cleanup
      const spinAnimation = Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      );
      
      spinAnimation.start();

      // Animate floating balls with enhanced effects and proper cleanup
      const ballAnimations = [];
      balls.forEach((ball) => {
        const createBallAnimation = () => {
          const duration = 6000 + Math.random() * 4000;
          const toX = Math.random() * width;
          const toY = Math.random() * height;
          const newScale = Math.random() * 0.7 + 0.3;
          const newOpacity = Math.random() * 0.7 + 0.3;
          
          const animation = Animated.parallel([
            Animated.timing(ball.position.x, {
              toValue: toX,
              duration,
              easing: Easing.bezier(0.2, 0.1, 0.3, 1),
              useNativeDriver: true,
            }),
            Animated.timing(ball.position.y, {
              toValue: toY,
              duration,
              easing: Easing.bezier(0.2, 0.1, 0.3, 1),
              useNativeDriver: true,
            }),
            Animated.timing(ball.scale, {
              toValue: newScale,
              duration: duration / 1.5,
              useNativeDriver: true,
            }),
            Animated.timing(ball.opacity, {
              toValue: newOpacity,
              duration: duration / 1.5,
              useNativeDriver: true,
            }),
          ]);
          
          animation.start(() => {
            if (isActive && isAnalyzing && !analysisComplete) {
              createBallAnimation();
            }
          });
          
          return animation;
        };
        ballAnimations.push(createBallAnimation());
        createBallAnimation();
      });

      // Cycle messages every 2 seconds
      const messageInterval = setInterval(() => {
        if (!analysisComplete) {
          setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
        }
      }, 2000);

      return () => {
        isActive = false;
        // Clean up all animations and listeners
        progressAnimation.stop();
        textAnimation.stop();
        shakeAnimation.stop();
        spinAnimation.stop();
        progressValue.removeListener(progressListener);
        progressValue.setValue(0);
        textOpacity.setValue(0);
        shakeValue.setValue(0);
        spinValue.setValue(0);
        clearInterval(messageInterval);
        
        // Reset all ball animations
        ballAnimations.forEach(animation => animation.stop());
        balls.forEach(ball => {
          ball.position.x.setValue(Math.random() * width);
          ball.position.y.setValue(Math.random() * height);
          ball.scale.setValue(Math.random() * 0.5 + 0.5);
          ball.opacity.setValue(Math.random() * 0.5 + 0.5);
        });
      };
    }
  }, [isAnalyzing]);

  return (
    <LinearGradient colors={['#000000', '#220000', '#440000']} style={styles.container}>
      {/* Floating balls with enhanced effects */}
      {balls.map((ball, index) => (
        <Animated.View
          key={index}
          style={[
            styles.floatingBall,
            {
              transform: [
                { translateX: ball.position.x },
                { translateY: ball.position.y },
                { scale: ball.scale },
              ],
              opacity: ball.opacity,
              backgroundColor: ball.color, // Use the color from the ball object
            },
          ]}
        />
      ))}
      {/* Analysis content */}
      <View style={styles.analyzingContainer}>
        <Animated.View
          style={[
            styles.spinner,
            {
              transform: [
                {
                  rotate: spinValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
            },
          ]}
        />
        <Animated.Text style={[styles.analyzingText, { opacity: textOpacity }]}>
          {messages[currentMessageIndex]}
        </Animated.Text>
        <Animated.Text 
          style={[
            styles.progressText, 
            { 
              opacity: textOpacity,
              transform: [
                {
                  translateX: shakeValue.interpolate({
                    inputRange: [-1, 0, 1],
                    outputRange: [-8, 0, 8],
                  }),
                },
                {
                  translateY: shakeValue.interpolate({
                    inputRange: [-1, 0, 1],
                    outputRange: [4, 0, -4],
                  }),
                },
              ],
            }
          ]}
        >
          {progress}%
        </Animated.Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  analyzingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 6,
    borderColor: '#2196F3',
    borderTopColor: 'transparent',
    marginBottom: 20,
  },
  analyzingText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  progressText: {
    fontSize: 48,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  floatingBall: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    // backgroundColor moved to inline style to access individual ball color
    shadowColor: '#FF0000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
});
