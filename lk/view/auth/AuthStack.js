import { createStackNavigator } from 'react-navigation'
import PasswordLoginView from './PasswordLoginView'
import ScanRegisterView from './ScanRegisterView'
import SelectUserView from './SelectUserView'
import RegisterView from './RegisterView'
import CheckCodeView from './CheckCodeView'

const StackNavigator = createStackNavigator({
  RegisterView,
  PasswordLoginView,
  SelectUserView,
  CheckCodeView
}, {
})

export default StackNavigator
