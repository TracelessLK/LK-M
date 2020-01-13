---
id: sendMsg
title: sendMsg
sidebar_label: sendMsg
---

消息体
```
 {
            body: {
                 content: {
                    {
                      type:0, 消息类型, 文本, 图片等
                       data: 消息内容
                    }',
                 },
                  isGroup: 0, 是否是群消息
                  chatId: uuid, 该聊天会话id, 是对方uuid或者群id
            },
            header: {
                id,
                action: "sendMsg"
                did,
                uid,
                time,
                timeout,
                verion,
                target: Array, 发送设备did数组
            }
            
 }
```

## 说明
1. 由客户端发起
2. 客户端发送消息, 服务端接受消息后检查滞留消息和是否有新的成员或者设备, 如果有,
则发送给客户端
