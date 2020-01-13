---
id: setUserPic
title: setUserPic
sidebar_label: setUserPic
---

消息体
```
 {
            body: {
                content: {
                   name: String,
                },
            },
            header: {
                id,
                action: "setUserPic"
                did,
                uid,
                time,
                timeout,
                verion
            }
            
 }
```

## 说明
1. 由客户端发起
2. 重新设置头像