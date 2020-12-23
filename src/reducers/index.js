import {combineReducers} from 'redux';
import mcq from './mcq';
import board from './Board';

const allReducers = combineReducers({
    mcqReducer: mcq,
    boardReducer: board
})

export default allReducers;