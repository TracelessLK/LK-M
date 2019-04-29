

## 版本原生更新

* ios: info.plist CFBundleShortVersionString
* android: app/build.gradle versionName

## 分支
```
开发环境分支（dev_z分支）
生产环境分支 (publish分支)
稳定分支 （master分支）
```

## ios scheme and target
1. LK_dev 开发, bundleId: com.traceless.dev
2. LK_M, hfs正式使用app, bundleId: com.LK_M
3. traceless, 客户正式使用app, bundleId: com.traceless
4. LK_staging, 测试发版app, bundleId: com.traceless.staging
