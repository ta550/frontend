import {combineReducers} from 'redux';
import mcq from './mcq';
import board from './Board';
import setLogin from './LoginAndLogout'
import theory from './theory'

const allReducers = combineReducers({
    mcqReducer: mcq,
    boardReducer: board,
    loginReducer: setLogin,
    theoryReducer: theory
})

export default allReducers;