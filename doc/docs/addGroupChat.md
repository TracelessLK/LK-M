---
id: addGroupChat
title: addGroupChat
sidebar_label: addGroupChat
---

消息体
```
 {
            body: {
                content: {
                   chatId,
                   name: String, 群名称,
                    members: Array, 群成员信息
                },
            },
            header: {
                id,
                action: "addGroupChat"
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
2. 添加群组, 服务端接受到消息后, 进行数据库操作, 再推送到群相关设备
