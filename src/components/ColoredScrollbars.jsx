import React, { Component } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";

export default class ColoredScrollbars extends Component {
  constructor(props, ...rest) {
    super(props, ...rest);
    this.state = { top: 0 };
    this.handleUpdate = this.handleUpdate.bind(this);
    this.renderThumb = this.renderThumb.bind(this);
  }

  handleUpdate(values) {
    const { top } = values;
    this.setState({ top });
  }

  renderThumb({ style, ...props }) {
    const { top } = this.state;
    const thumbStyle = {
      // backgroundColor: `rgb(${Math.round(255 - top * 255)}, ${Math.round(
      //   255 - top * 255
      // )}, ${Math.round(255 - top * 255)})`,
      backgroundColor: `rgb(255, 255, 255, 0.5)`,
    };
    return <div style={{ ...style, ...thumbStyle }} {...props} />;
  }

  render() {
    return (
      <Scrollbars
        renderThumbHorizontal={this.renderThumb}
        renderThumbVertical={this.renderThumb}
        onUpdate={this.handleUpdate}
        {...this.props}
      />
    );
  }
}
