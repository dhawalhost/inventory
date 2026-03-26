import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import api from '../api';

export default function ItemListScreen() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    api.get('/items')
      .then(res => setItems(res.data))
      .catch(() => setItems([]));
  }, []);
  return (
    <FlatList
      data={items}
      keyExtractor={item => item.id}
      renderItem={({item}) => (
        <Text>{item.name} ({item.quantity} {item.unit})</Text>
      )}
    />
  );
}