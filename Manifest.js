import ConfigManager from './common/core/ConfigManager'
import WSChannel from './lk/net/LKWSChannel'
import LKUserProvider from './lk/logic/provider/LKUserProvider'
import LKContactProvider from './lk/logic/provider/LKContactProvider'

ConfigManager.configure("WSChannel",WSChannel);
ConfigManager.configure("LKUserProvider",LKUserProvider);
ConfigManager.configure("LKContactProvider",LKContactProvider);


module.exports = ConfigManager;
