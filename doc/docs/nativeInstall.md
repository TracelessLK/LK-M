---
id: nativeInstall
title: 原生安装
sidebar_label: 原生安装
---



## ios

1. link CameraRoll

> 在ChatView.js使用了saveToCameraRoll方法

2. link lottie-react-native

```
    react-native link lottie-ios
    react-native link lottie-react-native
```
 open the Xcode project configuration 'general' tab, and add the Lottie.framework as Embedded Binaries

## android
```
react-native link lottie-react-native
```
