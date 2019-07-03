import React from 'react'
import renderer from 'react-test-renderer'
import {Platform} from "react-native"
import EntryView from '../../../../lk/view/index/EntryView'

jest.mock('react-native-update')
jest.mock('react-native-camera', () => 'Camera')
jest.mock('react-native-fs', () => () => {
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

test('renders Regular EntryView', () => {
  const schemeName = 'lkapp'
  const prefix = Platform.OS === 'android' ? `${schemeName}://${schemeName}/` : `${schemeName}://`
  renderer.create(
    <EntryView uriPrefix={prefix}/>
  )
})
