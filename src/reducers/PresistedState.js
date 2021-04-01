class StateLoader {
  loadState() {
    try {
      let serializedState = localStorage.getItem("ReactRedux:state");

      if (serializedState === null) {
        return this.initializeState();
      }

      return JSON.parse(serializedState);
    } catch (err) {
      return this.initializeState();
    }
  }

  saveState(state) {
    try {
      let serializedState = JSON.stringify(state);
      localStorage.setItem("ReactRedux:state", serializedState);
    } catch (err) {}
  }

  initializeState() {
    return [];
  }
}

export default StateLoader;
