---
id: readReport
title: readReport
sidebar_label: readReport
---

消息体
```
 {
            body: {
                content: {
                    msgIds: Array, 已读消息的id数组,
                    chatId,
                    isGroup,
                },
            },
            header: {
                id,
                action: "readReport"
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
2. 客户端读取消息后更新本地消息读取状态, 发送到服务端, 服务端向发送设备或者
群相关设备推送已读消息
