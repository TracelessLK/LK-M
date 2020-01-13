---
id: ping
title: ping
sidebar_label: ping
---

消息体
```
 {
            body: {
                content: {
                  
                },
            },
            header: {
                id,
                action: "ping"
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
2. 重置设备, 客户端清空所有数据, 服务端清空设备信息