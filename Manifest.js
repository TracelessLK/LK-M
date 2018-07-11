import LKApplication from './lk/LKApplication'
import LogcalLoginHandler from "./common/logic/handler/login/LocalLoginHandler"

const application = new LKApplication("LK").start();
application.setLoginHandler(new LogcalLoginHandler());

