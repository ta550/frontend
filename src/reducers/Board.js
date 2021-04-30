const board = (state = [], action) => {
  switch (action.type) {
    case "add_board":
      return [
        ...state,
        {
          subject: action.subject,
          system: action.system,
          board: action.board,
          series: action.series,
          paper: action.paper,
          date: action.date,
          is_theory: action.is_theory,
        },
      ];
    case "remove_board":
      return state.filter((item, index) => action.index !== index);
    case "reset_board":
      return [];
    default:
      return state;
  }
};

export default board;
