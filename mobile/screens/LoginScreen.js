import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import api from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const handleLogin = async () => {
    try {
      const res = await api.post('/auth/login', { email, password });
      await AsyncStorage.setItem('token', res.data.token);
      navigation.replace('Dashboard');
    } catch {
      setErr('Login failed');
    }
  };

  return (
    <View>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Login" onPress={handleLogin} />
      {err ? <Text>{err}</Text> : null}
    </View>
  );
}