---
id: login
title: login
sidebar_label: login
---

消息体
```
 {
            body: {
                header: {
                    id,
                    action: "login"
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
2. 登录成功后发起该请求
3. 服务端接受到login消息后, 检查是否有滞留消息, 如有滞留消息, 发送滞留消息
