const Device = require('../../store/Device')
class LKDeviceProvider{
    asyGetAll(contactId){
        return Device.getAll(contactId);
    }
    asyGetDevice(deviceId){
        return Device.getDevice(deviceId);
    }
}
module.exports = new LKDeviceProvider();

