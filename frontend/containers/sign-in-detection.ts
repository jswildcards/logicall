import { connect } from "react-redux";
import { setUser } from "../actions";
import SignInDetection from "../components/sign-in-detection";

// Redux: redirect states and dispatches to React components Props
const mapStateTpProps = (state) => ({
  user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
  setUser: (user) => dispatch(setUser(user)),
});

export default connect(mapStateTpProps, mapDispatchToProps)(SignInDetection);
