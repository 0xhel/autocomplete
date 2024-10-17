import { useState } from 'react';
import { ImageBackground, Platform, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function App() {
  const [dataSet, setDataSet] = useState([]);
  const [citiesData, setCitiesData] = useState([]);

  const searchCity = (query) => {
    // Prevent search with an empty query
    if (query === '') {
      return;
    }

    fetch(`https://api-adresse.data.gouv.fr/search/?q=${query}`)
      .then((response) => response.json())
      .then(({ features }) => {
        const suggestions = features.map((data, i) => {
          return { id: i, title: data.properties.name, context: data.properties.context };
        });
        setDataSet(suggestions);
      });
  };

  const cities = citiesData.map((data, i) => {
    return (
      <View key={i} style={styles.resultContainer}>
        <MaterialCommunityIcons name="map-marker-check" size={30} color="#51e181" />
        <View>
          <Text style={{ ...styles.resultText, ...styles.resultTitle }}>{data.title}</Text>
          <Text style={styles.resultText}>{data.context}</Text>
        </View>
      </View>
    );
  });

  return (
    <ImageBackground source={require('./assets/background.png')} style={styles.container}>
      <Text style={styles.title}>Where are we going?</Text>
      <AutocompleteDropdown
        onChangeText={(value) => searchCity(value)}
        onSelectItem={(item) => item && setCitiesData([...citiesData, item])}
        dataSet={dataSet}
        textInputProps={{ placeholder: 'Search city' }}
        inputContainerStyle={styles.inputContainer}
        containerStyle={styles.dropdownContainer}
        suggestionsListContainerStyle={styles.suggestionListContainer}
        closeOnSubmit
      />
      <ScrollView style={styles.scrollContainer}>
        {cities}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 25,
    paddingTop: 50,
  },
  scrollContainer: {
    width: '100%',
  },
  dropdownContainer: {
    width: '100%',
    marginBottom: 20,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#51e181',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 50,
    color: '#51e181',
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
    marginBottom: 15,
  },
  suggestionListContainer: {
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  resultContainer: {
    backgroundColor: '#ffffff',
    width: '100%',
    borderRadius: 6,
    padding: 20,
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: '#51e181',
    borderWidth: 1,
  },
  resultText: {
    textAlign: 'right',
  },
  resultTitle: {
    fontWeight: 'bold',
  },
});
