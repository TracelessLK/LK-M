import 'react-native';
import React from 'react';
import App from '../Entry';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
jest.mock('react-native-camera', () => 'Camera')
jest.mock('react-native-fs', () => {
    return {
        mkdir: jest.fn(),
        moveFile: jest.fn(),
        copyFile: jest.fn(),
        pathForBundle: jest.fn(),
        pathForGroup: jest.fn(),
        getFSInfo: jest.fn(),
        getAllExternalFilesDirs: jest.fn(),
        unlink: jest.fn(),
        exists: jest.fn(),
        stopDownload: jest.fn(),
        resumeDownload: jest.fn(),
        isResumable: jest.fn(),
        stopUpload: jest.fn(),
        completeHandlerIOS: jest.fn(),
        readDir: jest.fn(),
        readDirAssets: jest.fn(),
        existsAssets: jest.fn(),
        readdir: jest.fn(),
        setReadable: jest.fn(),
        stat: jest.fn(),
        readFile: jest.fn(),
        read: jest.fn(),
        readFileAssets: jest.fn(),
        hash: jest.fn(),
        copyFileAssets: jest.fn(),
        copyFileAssetsIOS: jest.fn(),
        copyAssetsVideoIOS: jest.fn(),
        writeFile: jest.fn(),
        appendFile: jest.fn(),
        write: jest.fn(),
        downloadFile: jest.fn(),
        uploadFiles: jest.fn(),
        touch: jest.fn(),
        MainBundlePath: jest.fn(),
        CachesDirectoryPath: jest.fn(),
        DocumentDirectoryPath: jest.fn(),
        ExternalDirectoryPath: jest.fn(),
        ExternalStorageDirectoryPath: jest.fn(),
        TemporaryDirectoryPath: jest.fn(),
        LibraryDirectoryPath: jest.fn(),
        PicturesDirectoryPath: jest.fn(),
    };
});
jest.mock('react-native-fetch-blob', () => {
    return {
        DocumentDir: () => {},
        polyfill: () => {},
    }
});
jest.mock('react-native-sqlite-storage', () => {
    // const mockSQLite = require('react-native-sqlite-storage');
    const mockSQLite = {
        openDatabase: () => {
            return {
                transaction: () => {
                }
            };
        }
    }

    return mockSQLite;
});
it('renders correctly', () => {
     renderer.create(
        <App />
    );
});
