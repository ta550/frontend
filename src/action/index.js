export const add_board = (data) => {
    return {
        type: "add_board",
        subject: data.subject, 
        system: data.system, 
        board: data.board, 
        series: data.series, 
        paper: data.paper, 
        year: data.year, 
        month: data.month
    };
}

export const remove_board = (index) => {
    return {
        type: "remove_board",
        index,
    };
};

export const reset_board = () => {
    return {
        type: "reset_board"
    };
};


//  Mcq action
export const add_mcq = data => {
    return {
        type: "add_mcq",
        question: data.question,
        marks: data.marks, 
        options: data.options,
        topics: data.topics
    };
};


export const update_mcq = data => {
    return {
        type: "update_mcq",
        question: data.question,
        index: data.index,
        marks: data.marks, 
        topics: data.topics,
        options: data.options
    };
};


export const remove_mcq = index => {
    return {
        type: "remove_mcq",
        index
    }
}

export const reset_mcq = () => {
    return {
        type: "reset_mcq"
    };
}


export const add_mcqs_complete = (data) => {
    return {
        type: "add_complete",
        data: data
    }
}