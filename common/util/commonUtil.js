const commonUtil = {
    getTimeDisplay: function () {
        const date = new Date();
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    },
    runFunc(func){
        if(func){
            func()
        }
    },
    debounceFunc(func,interval = 1000*2){
        return _.throttle(func,interval,{
            leading:true,
            trailing:false
        })
    },
    getFolderId(filePath){
        return filePath.split('/')[6]
    }
}

module.exports = commonUtil
