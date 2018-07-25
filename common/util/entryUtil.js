


const entryUtil = {
    init(){
        console.ignoredYellowBox = ['Setting a timer','Remote debugger']

        require('ErrorUtils').setGlobalHandler((error)=> {
           console.log(error)
           
        });
    }
}

module.exports = entryUtil

