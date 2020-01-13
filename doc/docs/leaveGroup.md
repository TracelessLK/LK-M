---
id: leaveGroup
title: leaveGroup
sidebar_label: leaveGroup
---

消息体
```
 {
            body: {
                content: {
                  chatId
                },
            },
            header: {
                id,
                action: "leaveGroup"
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
2. 离群, 服务端推送到群成员设备, 进行清空操作
