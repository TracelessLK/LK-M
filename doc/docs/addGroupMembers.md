---
id: addGroupMembers
title: addGroupMembers
sidebar_label: addGroupMembers
---

消息体
```
 {
            body: {
                content: {
                   chatId,
                   members: Array, 群成员信息
                },
            },
            header: {
                id,
                action: "addGroupMembers"
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
2. 添加群成员
