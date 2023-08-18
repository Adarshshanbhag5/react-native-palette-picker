import * as React from 'react';

import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from 'react-native';
import {
  getPalette,
  type ImageColorsResult,
} from 'react-native-palette-picker';
import { base64 } from './base64Img';

const localImg = require('../assets/breaking-bad.jpg');

type ItemData = {
  id: string;
  title: string;
  source: string;
};

type ItemProps = {
  item: ItemData;
  onPress: () => void;
  backgroundColor: string;
  textColor: string;
};

const DATA: ItemData[] = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'Local file',
    source: localImg,
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'URL',
    source:
      'https://images.unsplash.com/photo-1691882663192-32b90fda82ee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Base 64',
    source: base64,
  },
];

const Item = ({ item, onPress, backgroundColor, textColor }: ItemProps) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.list_item, { backgroundColor }]}
  >
    <Text style={[styles.listItem_text, { color: textColor }]}>
      {item.title}
    </Text>
  </TouchableOpacity>
);

export default function App() {
  const [result, setResult] = React.useState<ImageColorsResult>();
  const [err, setErr] = React.useState<unknown>();
  const [selectedId, setSelectedId] = React.useState<string>(
    'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba'
  );
  const [imgUri, setImgUri] = React.useState<string>(localImg);

  const renderItem = ({ item }: { item: ItemData }) => {
    const backgroundColor =
      item.id === selectedId
        ? result
          ? result.lightMuted
          : '#555'
        : result
        ? result.muted
        : '#fff';
    const color = item.id === selectedId ? 'black' : 'white';

    return (
      <Item
        item={item}
        onPress={() => {
          setSelectedId(item.id);
          setImgUri(item.source);
        }}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
  };

  React.useEffect(() => {
    (async () => {
      try {
        const res = await getPalette(imgUri, {
          fallback: '#ff0000',
          fallbackTextColor: '#ffffff',
        });
        setResult(res);
      } catch (error) {
        setErr(error);
      }
    })();
  }, [imgUri]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: result?.vibrant }]}
    >
      <View>
        <Text style={[styles.appTitle, { color: result?.titleTextColor }]}>
          React Native Palette Picker
        </Text>
        <FlatList
          data={DATA}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          extraData={selectedId}
          style={styles.list}
          numColumns={3}
        />
      </View>
      <View style={styles.section}>
        <Image
          source={
            selectedId === 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba'
              ? localImg
              : { uri: imgUri }
          }
          style={styles.img}
        />
        <View style={styles.palette_container}>
          {result &&
            Object.keys(result).map((key, i) => (
              <View
                style={[
                  styles.color,
                  { backgroundColor: result[key as keyof ImageColorsResult] },
                ]}
                key={i}
              >
                <Text style={styles.colorText}>{key}</Text>
              </View>
            ))}
          {result && (
            <>
              <Text style={styles.JsonTextTitle}>Result</Text>
              <Text style={styles.JsonText}>{JSON.stringify(result)}</Text>
            </>
          )}
          {err && (
            <>
              <Text style={styles.JsonTextTitle}>Error</Text>
              <Text style={styles.JsonText}>{JSON.stringify(err)}</Text>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 15,
    textAlign: 'center',
  },
  list: {
    marginHorizontal: 8,
    marginBottom: 10,
  },
  list_item: {
    padding: 8,
    marginHorizontal: 5,
    width: '30%',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#000',
  },
  listItem_text: {
    fontSize: 18,
    textAlign: 'center',
  },
  section: {
    alignItems: 'center',
  },
  img: {
    height: 300,
    width: 300,
    objectFit: 'cover',
    aspectRatio: 1,
    marginBottom: 15,
    borderRadius: 5,
    borderColor: '#000',
    borderWidth: 2,
  },
  palette_container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 5,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    gap: 5,
  },
  color: {
    width: '30%',
    height: 60,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderColor: '#000',
    borderWidth: 2,
  },
  colorText: {
    fontWeight: 'bold',
  },
  JsonTextTitle: {
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 10,
    fontSize: 18,
  },
  JsonText: {
    color: '#fff',
    paddingHorizontal: 10,
    fontSize: 16,
  },
});
