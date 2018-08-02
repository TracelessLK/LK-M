import ConfigManager from './common/core/ConfigManager'
import WSChannel from './lk/net/LKWSChannel'

ConfigManager.configure("WSChannel",WSChannel);


module.exports = ConfigManager;
