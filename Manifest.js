import LKApplication from './lk/LKApplication'
import LKUserHandler from './lk/logic/handler/LKUserHandler'
import LocalLoginHandler from "./lk/logic/handler/LKLoginHandler"
import LKOrgHandler from "./lk/logic/handler/LKOrgHandler"
import LKContactHandler from "./lk/logic/handler/LKContactHandler"

import LKOrgProvider from './lk/logic/provider/LKOrgProvider'
import LKUserProvider from './lk/logic/provider/LKUserProvider'
import LKDeviceProvider from './lk/logic/provider/LKDeviceProvider'
import LKContactProvider from './lk/logic/provider/LKContactProvider'
import LKChatProvider from './lk/logic/provider/LKChatProvider'
import ContactManager from './lk/core/ContactManager'
import ChatManager from './lk/core/ChatManager'
import LKWSChannel from './lk/net/LKWSChannel'



const application = new LKApplication("LK");

application.setLKOrgHandler(LKOrgHandler);
application.setLKContactHandler(LKContactHandler);

application.setLKUserProvider(LKUserProvider);
application.setLKUserHandler(LKUserHandler);
application.setLoginHandler(LocalLoginHandler);
application.setLKOrgProvider(LKOrgProvider);
application.setLKDeviceProvider(LKDeviceProvider);
application.setLKContactProvider(LKContactProvider);
application.setContactManager(ContactManager);
application.setChatManager(ChatManager);
application.setLKWSChannelClass(LKWSChannel);

application.start();
