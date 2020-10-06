import { connect } from "react-redux";
import { increment } from "../actions";
import Increment from "../components/Increment";

// Redux: redirect states and dispatches to React components Props
const mapStateTpProps = (state) => ({
  counter: state.counter.value,
});

const mapDispatchToProps = (dispatch) => ({
  increment: () => dispatch(increment),
});

export default connect(mapStateTpProps, mapDispatchToProps)(Increment);
