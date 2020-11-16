export default function user(
  state = {},
  action,
) {
  switch (action.type) {
    case "user/set-user": {
      return {
        ...state,
        user: action.payload,
      };
    }
    default:
      return state;
  }
}
