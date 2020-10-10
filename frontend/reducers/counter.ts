// Redux: handle actions dispatched
export default function counter(state = { value: 0 }, action) {
  if (action.type === "counter/increment") {
    return {
      ...state,
      value: state.value + 1,
    };
  }

  return state;
}
