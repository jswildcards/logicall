export default function user(state = { name: "", password: "" }, action) {
  switch (action.type) {
    case "user/sign-in":
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}
