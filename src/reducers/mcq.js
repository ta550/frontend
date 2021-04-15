const mcq = (state = [], action) => {
  switch (action.type) {
    case "add_mcq":
      return [
        ...state,
        {
          question: action.question,
          marks: action.marks,
          options: action.options,
          topics: action.topics,
          images: action.images,
        },
      ];
    case "remove_mcq":
      return state.filter((item, index) => action.index !== index);
    case "update_mcq":
      let items = [...state];
      let item = { ...items[action.index] };
      item.question = action.question;
      item.marks = action.marks;
      item.options = action.options;
      item.topics = action.topics;
      item.images = action.images;
      items[action.index] = item;
      return items;
    case "reset_mcq":
      return [];
    default:
      return state;
  }
};

export default mcq;
