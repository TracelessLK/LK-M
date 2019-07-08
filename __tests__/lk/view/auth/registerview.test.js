import 'react-native'
import RegisterView from '../../../../lk/view/auth/RegisterView'

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

describe('registerview', () => {
  let register = {
    action: "register",
    code: "LK",
    hasCheckCode: false,
    id: "61e1241a-f8d5-4942-9801-9fbfc7e6e78e",
    ip: "172.18.1.198",
    mCode: "2d4ac25737a7222fb923788e144f2bca",
    name: "test_01",
    orgId: "7cf0b283-29d0-49c9-8f09-a8313a62f55b",
    port: 3001,
    signature: "6f4d1cf8fed17caf0dc0ff205ddf16444349f8078a0912366424ab32f6bca3497453ab8175d53d40886a94c0b901b49400deafb58b92130422bc210764846b11",
    ticketId: "d63ae9db-5706-4bd3-a6cc-3d453f1d1ce8",
    url: "http://172.18.1.198:3000"
  }
  let obj = {
    register
  }
  let qrcode = "8c7ff4b4d34ad693b441d602d76659cb9490e98127ad3a3d07e8c5ba35d0de89e6585d37ba71a9cf7d2ca6c591c23dbbe54e59747beb7ac522eaa9dbc6663c1b9c9d0bfbc2653713e746ab9af1492dbb48d4e5e2a53b1cc73f8d7572f1035923ca46fb8bbd412cff82f1a5856f3516d0c851138f2ebbd94577e3aa89702400fd4a03c9d5c0372a97e315c1747a23066ff5604e20ae9bcd41f8662be169e7e974fca7fd702cc54afa5be69e06bc7f27055e8182ec0a3a10e5b9373796f333dce807da5a542f47343940ab28c07ce48a7babbb1c2c597ffc2af873e24d37d3dc94ff02edbb9717e4055a665cd0ada8a3bd6f070160afe2685692754eb1ddf25d5d62313e00f8ba09baceb2c17b41bc1dfed1b36dd8e5ae068f6b35ea7faa0b51bb1b53135ca5f50b3c62aee0863217eb922beea64f8b438ae03aabf1680c741e7fed9a0eb9bc452dc161ad5a77565c03d50eb82d9425f7af8794031f560ee712a3a8308d5f22863fb50d0dd0a93f791fd741eac2c42d26fc30bd8b425c699c3580a52eb1368372a203224829b7dce973c4d462f452385c19d6cdf5c3ce04e2e9d4641daf9b396375a0e58a30e21ed12193fd659729bbb636fc1a30e6e97e01db30d29f9122f581da3a13640eef170929"
  let params = {
    obj,
    qrcode
  }
  let state = {
    params
  }
  let navigation = {
    state
  }
  function registerf(props) {
    return new RegisterView(props).register()
  }
  describe('input check', () => {
    it('Verification code is empty', () => {
      let props = {
        navigation,
        checkCode: '',
        password: '',
        passwordAgain: ''
      }
      registerf(props)
    })
  })
})
