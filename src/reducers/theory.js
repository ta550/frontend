const theory = (state = [] , action) => {
    switch(action.type) {
        case 'add_theory':
            return [...state, { question: action.question , answer: action.answer , marks: action.marks , topics: action.topics }]
        case 'update_theory':
            let items = [...state];
            let item = {...items[action.index]};
            item.question = action.question;
            item.answer = action.answer;
            item.marks = action.marks;
            item.topics = action.topics;
            items[action.index] = item;
            return items;
        case 'remove_theory':
            return state.filter((item,index) => action.index !== index);
        case 'reset_theory':
            return []
        default:
            return state
    }
}

export default theory