export const add_board = (data, theory) => {
  return {
    type: "add_board",
    subject: data.subject,
    system: data.system,
    board: data.board,
    series: data.series,
    paper: data.paper,
    date: data.date,
    is_theory: theory ? true : false,
  };
};

export const remove_board = (index) => {
  return {
    type: "remove_board",
    index,
  };
};

export const reset_board = () => {
  return {
    type: "reset_board",
  };
};

//  Mcq action
export const add_mcq = (data) => {
  return {
    type: "add_mcq",
    question: data.question,
    marks: data.marks,
    options: data.options,
    topics: data.topics,
    images: data.images,
  };
};

export const update_mcq = (data) => {
  return {
    type: "update_mcq",
    question: data.question,
    index: data.index,
    marks: data.marks,
    topics: data.topics,
    options: data.options,
    images: data.images,
  };
};

export const remove_mcq = (index) => {
  return {
    type: "remove_mcq",
    index,
  };
};

export const reset_mcq = () => {
  return {
    type: "reset_mcq",
  };
};

export const add_theory = (data) => {
  return {
    type: "add_theory",
    question: data.question,
    answer: data.answer,
    marks: data.marks,
    topics: data.topics,
    images: data.images,
  };
};

export const update_theory = (data) => {
  return {
    type: "update_theory",
    question: data.question,
    answer: data.answer,
    marks: data.marks,
    topics: data.topics,
    images: data.images,
    index: data.index,
  };
};

export const remove_theory = (data) => {
  return {
    type: "remove_theory",
    index: data.index,
  };
};

export const reset_theory = (data) => {
  return {
    type: "reset_theory",
  };
};
