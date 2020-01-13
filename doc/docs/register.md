---
id: register
title: register
sidebar_label: register
---

消息体
```
 {
            body: {
                content: {
                   venderDid: String, 苹果的推送id,
                    pk: 客户端公钥, 
                    checkCode: String, 验证码, 
                    qrCode: String, 二维码, 
                    description: String, 手机型号, 
                    introducerDid: uuid, 推荐设备id
                },
                header: {
                    id,
                    action: "register"
                    did,
                    uid,
                    time,
                    timeout,
                    verion
                }
            }
 }
```

## 说明
1. 由客户端发起
2. 注册, 服务端校验验证码和二维码是否被篡改, 设备是否重复注册等
