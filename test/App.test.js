/* eslint-disable no-empty-function */

import 'react-native'
import App from '../Entry'
import React from 'react'

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer'
jest.mock('react-native-camera', () => 'Camera')
jest.mock('react-native-fs', () => {
  return {
    appendFile: jest.fn(),
    CachesDirectoryPath: jest.fn(),
    completeHandlerIOS: jest.fn(),
    copyAssetsVideoIOS: jest.fn(),
    copyFile: jest.fn(),
    copyFileAssets: jest.fn(),
    copyFileAssetsIOS: jest.fn(),
    DocumentDirectoryPath: jest.fn(),
    downloadFile: jest.fn(),
    exists: jest.fn(),
    existsAssets: jest.fn(),
    ExternalDirectoryPath: jest.fn(),
    ExternalStorageDirectoryPath: jest.fn(),
    getAllExternalFilesDirs: jest.fn(),
    getFSInfo: jest.fn(),
    hash: jest.fn(),
    isResumable: jest.fn(),
    LibraryDirectoryPath: jest.fn(),
    MainBundlePath: jest.fn(),
    mkdir: jest.fn(),
    moveFile: jest.fn(),
    pathForBundle: jest.fn(),
    pathForGroup: jest.fn(),
    PicturesDirectoryPath: jest.fn(),
    read: jest.fn(),
    readDir: jest.fn(),
    readdir: jest.fn(),
    readDirAssets: jest.fn(),
    readFile: jest.fn(),
    readFileAssets: jest.fn(),
    resumeDownload: jest.fn(),
    setReadable: jest.fn(),
    stat: jest.fn(),
    stopDownload: jest.fn(),
    stopUpload: jest.fn(),
    TemporaryDirectoryPath: jest.fn(),
    touch: jest.fn(),
    unlink: jest.fn(),
    uploadFiles: jest.fn(),
    write: jest.fn(),
    writeFile: jest.fn()
  }
})
jest.mock('react-native-fetch-blob', () => {
  return {
    DocumentDir: () => {},
    polyfill: () => {}
  }
})
jest.mock('react-native-sqlite-storage', () => {
  // const mockSQLite = require('react-native-sqlite-storage');
  const mockSQLite = {
    openDatabase: () => {
      return {
        transaction: () => {
        }
      }
    }
  }

  return mockSQLite
})
it('renders correctly', () => {
  renderer.create(
    <App />
  )
})
