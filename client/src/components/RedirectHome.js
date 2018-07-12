import React, {Component} from 'react';

class RedirectHome extends Component {
  componentDidMount() {
    this.props.history.push('/');
  }
  
  render() {
    return <div></div>;
  }
};

export default RedirectHome;

