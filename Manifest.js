import ConfigManager from './common/core/ConfigManager'
import WSChannel from './lk/net/LKWSChannel'
import LKUserProvider from './lk/logic/provider/LKUserProvider'

ConfigManager.configure("WSChannel",WSChannel);
ConfigManager.configure("LKUserProvider",LKUserProvider);


module.exports = ConfigManager;
