---
id: msgStructure
title: 公共消息体
---
```
消息体msg, Object类型, websocket通信时传输JSON字符串格式
        {
            body: {
                content: {
                   memberMCode: String, 成员MCode值拼接之后取md5值, 生成hex摘要,
                                成员的Mcode值由成员昵称和头像组合生成
                   orgMCode: String, 组织MCode值拼接之后取md5值, 生成hex摘要,
                             组织的Mcode值由组织名称生成
                },
                header: {
                    id: uuid, 消息体id,
                    action: String, 该消息体行为种类, eg. "ping"
                    did: uuid, 设备id,
                    uid: uuid, 当前登录用户id,
                    time: integer, 服务端消息体生成时间,
                    timeout: integer, 超时设置
                    verion: 消息协议版本号, eg. "1.0"
                }
            }
        }
```

## 说明
1. MCode用于对比判断服务端数据是否发生变化, 如果发生变化, 则进行同步操作
2. did, 设备id由设备注册时在客户端生成
3. timeout, 默认30s