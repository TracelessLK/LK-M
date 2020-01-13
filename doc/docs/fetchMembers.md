---
id: fetchMembers
title: fetchMembers
sidebar_label: fetchMembers
---

消息体
```
 {
            body: {
                content: {
                   members: array, 新成员的uid数组
                },
                header: {
                    id,
                    action: "fetchMembers"
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
1. 客户端检测到memberMcode发生变化后, 发起该请求, 
服务端接受后返回新成员信息, 本地更新对应的成员信息和MCode