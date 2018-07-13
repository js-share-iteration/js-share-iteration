import React from 'react';
import {Link} from 'react-router-dom';

const renderMessage = props => {
  if (props.auth === null) {
    return <div></div>;
  }
  
  if (props.auth) {
    return <p className="lead">Access your documents <Link to="/documents">here</Link>.</p>;
  }
  else {
    return <p><a className="btn btn-primary btn-lg" role="button" href="/auth/google">Sign In With Google</a>
    <a className="btn btn-success btn-lg" role="button" href="/auth/github">Sign In With Github</a></p>
  }
};


const Home = props => (
  <div className="container">
    <div className="jumbotron">
      <h1 className="display-4">Welcome to JS-Share!</h1>
      <p className="lead">The most advanced real time collaboration platform ever created.</p>
      <p className="lead">Utilizing Google Authentication to verify all users, you will be able to access your own documents while also sharing documents with other users that have signed up.</p>
      {renderMessage(props)}
    </div>
  </div>
);


export default Home;

