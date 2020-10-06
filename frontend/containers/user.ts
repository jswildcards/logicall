import { connect } from "react-redux";
import { signIn } from "../actions";
import User from "../components/User";

// Redux: redirect states and dispatches to React components Props
const mapStateTpProps = (state) => ({
  user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
  signIn: (user) => dispatch(signIn(user)),
});

export default connect(mapStateTpProps, mapDispatchToProps)(User);
