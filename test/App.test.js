import 'react-native';
import React from 'react';
import App from '../Entry';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
jest.mock('react-native-camera', () => 'Camera')
jest.mock('react-native-sqlite-storage', () => {
    // const mockSQLite = require('react-native-sqlite-storage');
    const mockSQLite = {
        openDatabase: (...args) => {
            return {
                transaction: (...args) => {
                    executeSql: (query) => { return []; }
                }
            };
        }
    }

    return mockSQLite;
});
it('renders correctly', () => {
    const tree = renderer.create(
        <App />
    );
});
