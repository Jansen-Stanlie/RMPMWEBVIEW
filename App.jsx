import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  StatusBar,
  BackHandler,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  StyleSheet,
  Platform,
  Alert,
  AppState,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {WebView} from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import RNFS from 'react-native-fs';

const App = () => {
  const WEBVIEW_REF = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [wasClosedCompletely, setWasClosedCompletely] = useState(false);

  useEffect(() => {
    const handleBackButton = () => {
      if (canGoBack && WEBVIEW_REF.current) {
        WEBVIEW_REF.current.goBack();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButton,
    );

    return () => {
      backHandler.remove();
    };
  }, [canGoBack]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleAppStateChange = nextAppState => {
      console.log('App State:', nextAppState);
      if (nextAppState === 'inactive' || nextAppState === 'background') {
        setWasClosedCompletely(true);
      }
    };

    AppState.addEventListener('change', handleAppStateChange);
    const mylistener = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    return () => {
      mylistener.remove();
    };
  }, []);

  useEffect(() => {
    console.log('wasClosedCompletely:', wasClosedCompletely);
    if (wasClosedCompletely) {
      clearAppData();
    }
  }, [wasClosedCompletely]);

  const onNavigationStateChange = navState => {
    setCanGoBack(navState.canGoBack);
  };

  const handleRefresh = () => {
    if (!refreshing && WEBVIEW_REF.current) {
      setRefreshing(true);
      WEBVIEW_REF.current.reload();
      setRefreshing(false);
    }
  };

  const clearAppData = async () => {
    try {
      // Clear AsyncStorage
      const keys = await AsyncStorage.getAllKeys();
      console.log('Keys:', keys);
      await AsyncStorage.multiRemove(keys);
      // Determine the app data directory based on platform
      let appDataDir;
      if (Platform.OS === 'ios') {
        appDataDir = RNFS.DocumentDirectoryPath;
      } else {
        appDataDir = RNFS.ExternalDirectoryPath; // Change this to the appropriate directory for Android
      }

      // Check if the directory exists before attempting to delete it
      const dirExists = await RNFS.exists(appDataDir);
      if (dirExists) {
        await RNFS.unlink(appDataDir);
        Alert.alert(
          'App Data Cleared',
          'App data has been cleared upon reopening again.',
          [{text: 'OK'}],
        );
      } else {
        console.warn('App data directory does not exist');
      }
      // Reset the flag after clearing data
      setWasClosedCompletely(false);

      Alert.alert(
        'App Data Cleared',
        'App data and cache have been cleared upon reopening.',
        [{text: 'OK'}],
      );
      console.log('App data and cache have been cleared');
    } catch (error) {
      console.error('Error clearing app data:', error);
    }
  };

  return (
    <View style={{flex: 1}}>
      <StatusBar backgroundColor="#000" barStyle="light-content" />
      {!isConnected ? (
        <View style={styles.centeredView}>
          <Text style={styles.errorText}>No Internet Connection</Text>
          <Text style={styles.errorText}>
            Please check your connection and try again
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{flex: 1}}
          showsVerticalScrollIndicator={false}>
          <WebView
            ref={WEBVIEW_REF}
            onNavigationStateChange={onNavigationStateChange}
            source={{
              uri: 'https://trucking.nabatisnack.co.id/trucking-monitoring/warehouseRMPMapp/',
            }}
            renderLoading={() => (
              <View style={[styles.loadingContainer, StyleSheet.absoluteFill]}>
                <ActivityIndicator size="large" color="#0000ff" />
              </View>
            )}
            startInLoadingState={true}
          />
        </ScrollView>
      )}
      <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  loadingContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
