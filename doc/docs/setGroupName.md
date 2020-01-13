---
id: setGroupName
title: setGroupName
sidebar_label: setGroupName
---

消息体
```
 {
            body: {
                content: {
                   chatId,
                   name: String, 群名称,
                },
            },
            header: {
                id,
                action: "setGroupName"
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
2. 重新设置群名称
