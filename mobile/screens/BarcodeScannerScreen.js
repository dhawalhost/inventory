import React, { useState, useEffect } from 'react';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { View, Text, Button } from 'react-native';

export default function BarcodeScannerScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    BarCodeScanner.requestPermissionsAsync().then(({ status }) =>
      setHasPermission(status === 'granted')
    );
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    // Look up product by barcode (data)
    navigation.navigate("AddItem", { barcode: data });
  };

  if (hasPermission === null) return <Text>Requesting camera permission...</Text>;
  if (hasPermission === false) return <Text>No access to camera</Text>;

  return (
    <BarCodeScanner
      onBarCodeScanned={handleBarCodeScanned}
      style={{ flex: 1 }}
    />
  );
}