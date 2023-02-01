import React from "react";
import ReactDOM from "react-dom";

class RefWrap extends React.Component {
  componentDidMount() {
    const { setRef } = this.props;
    if (setRef) setRef(ReactDOM.findDOMNode(this));
  }

  render() {
    const { children } = this.props;
    return React.Children.only(children);
  }
}

export default RefWrap;
