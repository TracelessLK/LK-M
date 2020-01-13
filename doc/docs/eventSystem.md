---
id: eventSystem
title: 客户端事件机制
sidebar_label: 客户端事件机制
---

### 总体说明
事件分两种:

    1. 原因: 如收到消息selfMsgReceived和发送消息
    
    2. 对应的行为: 如recentChange, chatChange等渲染界面
使用原则: 
    1. 应当等到数据库更新完毕再触发事件
    2. 触发事件要先过滤那些不必更新的情况
    3. self,other指的是消息属于self还是other

### ChatManager

公共参数: 

     1. source, 事件触发代码来源,如调用方法
     2. sourceEvent, 上级触发事件


1. recentChange
   - 触发场景: 在chat的新增和删除
   - 监听行为: 重新渲染recentView界面
   - 参数: 

2. chatChange
    - 触发场景: chat的头像,名称,最近一条消息,该chat未读消息数 发生改变时
    - 监听行为: 只重新渲染该单个chat
    - 参数: 
        1. chatId,
3. selfMsgRead: 
    - 触发场景: 自己的消息被别人读取
    - 监听行为: 重新渲染readStateView界面
    - 触发事件: msgStateChange
    - 参数: 
        1. msgId,
        2. readState
4. otherMsgRead:
    - 触发场景: 别人发来的消息在自己设备已读
    - 监听行为: 重新渲染对应的单个chat
    - 触发事件: msgBadgeChange, chatChange
    - 参数: 
        1. chatId
5. msgBadgeChange: 
    - 触发场景: 未读消息总数发生改变
    - 监听行为: 重新渲染最近图标和最近界面首页的总未读消息数
    - param: 
        1. num: 总未读消息数

6. otherMsgReceived
        - 触发场景: 收到消息
        - 触发事件: msgListChange, msgBadgeChange, 
        chatChange, recentChange
        - 参数: 
            1. chatId
        
7. selfMsgReceived

8. msgListChange
    - 监听行为: 重新渲染chatView 整个界面
    - 参数: 
        1. chatId

10. groupMemberChange: 
    - 触发场景: 群成员信息发生改变
    - 监听行为: 重新渲染整个groupinfo界面
    - 触发事件: chatChange, msgListChange

11. msgStateChange
    - 触发场景: 消息发送状态发生改变
    - 监听行为: 
        1. 渲染chatItem的最后一条消息 (todo)
        2. 渲染messageItem消息的状态
        3. 重新渲染ReadStateView
    - 触发事件: 
    - 参数: 
        1. msgId
        2. chatId
        3. state, 新的状态
12. groupNameChange
    - 触发场景: 群名称修改
    - 监听行为: 
        1. 
    - 触发事件: chatChange
    - 参数: 
        1. name
        2. chatId
13. msgSend
    - 触发场景: 发送消息成功
    - 触发事件: msgListChange, chatChange, recentChange
    - 参数: 
        1. chatId
14. msgItemChange
    - 触发事件: msgStateChange
    - 监听行为: 重新渲染单条消息记录
     
    
 
### ContactManager
1. contactChange
   - 触发场景: 新增或者删除好友
   - 监听行为: 重新渲染整个contact界面
2. personChange
   - 触发场景: 单个好友的信息,如名称,头像发生变化
   - 触发事件: chatChange, msgListChange
   
## WSChannel
1. channelChange: 
    - 触发场景: 
         1. 建立websocket连接失败
         2. websocket报错
         3. websocket close
         4. websocket open
    - 参数: 
        1. isConnected, boolean,是否连接
        2. error: 报错信息, Error instance
    - 触发事件: LKApplication的netStateChanged事件
## LKApplication
1. netStateChanged
    - 触发场景: WSChannel的channelChange事件
    - 参数: 
    
            1. isConnected, boolean,是否连接
            2. error: 报错信息, Error instance
2. currentUserChanged
    - 触发: 登入或登出
    - 参数:
        1.user
## MFApplyManager
1. receiveMFApply
    - 触发场景: 收到加好友请求
    - 监听行为: 渲染整个requestView界面

## UserManager: 
1. selfInfoChanged
    - 触发场景: 个人名称,头像发生改变
    - 监听行为: 重新渲染个人信息界面
    
