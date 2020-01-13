---
id: getAllDetainedMsg
title: getAllDetainedMsg
sidebar_label: getAllDetainedMsg
---

消息体
```
 {
            body: {
               
             },
             header: {
                    id,
                    action: "getAllDetainedMsg"
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
2. 触发场景是登录, 下拉刷新以及app从后台切到前台
3. 服务端接受后返回滞留消息
