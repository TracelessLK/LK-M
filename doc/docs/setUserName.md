---
id: setUserName
title: setUserName
sidebar_label: setUserName
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
                action: "setUserName"
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
2. 重新设置昵称