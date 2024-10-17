import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import App from './App';
const fetch = require('node-fetch');

const dummyCity = 'Fake city';

beforeAll(() => {
  window.fetch = (url, options) => {
    if (!url.includes('api-adresse.data.gouv.fr')) {
      return fetch(url, options);
    }

    return Promise.resolve({
      json: () => Promise.resolve({}),
    });
  };

  jest.spyOn(window, 'fetch');
});

// Silence the warning: Animated: `useNativeDriver` is not supported...
//jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');



it('Search city', async () => {
  render(<App />);

  const searchInput = screen.queryByPlaceholderText(/Search city/i);
  expect(searchInput).toBeTruthy();

  fireEvent.changeText(searchInput, dummyCity);

  expect(searchInput.props.value).toBe(dummyCity);

  // Wait for fetch to be called
  await waitFor(() => {
    expect(window.fetch).toHaveBeenCalled();
    expect(window.fetch).toHaveBeenCalledWith(expect.stringContaining(dummyCity));
  });
});
