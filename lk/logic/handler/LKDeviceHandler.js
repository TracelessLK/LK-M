const Device = require('../../store/Device')
class LKDeviceHandler{
    asyAddDevices(contactId,devices){
        return Device.addDevices(contactId,devices);
    }

    asyRemoveDevices(contactId,devices){
        return Device.removeDevices(contactId,devices);
    }
}
module.exports = new LKDeviceHandler();

