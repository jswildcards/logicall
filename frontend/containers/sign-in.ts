import { connect } from "react-redux";
import { setUser } from "../actions";
import SignInForm from "../components/sign-in-form";

// Redux: redirect states and dispatches to React components Props
const mapStateTpProps = (state) => ({
  user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
  setUser: (user) => dispatch(setUser(user)),
});

export default connect(mapStateTpProps, mapDispatchToProps)(SignInForm);
