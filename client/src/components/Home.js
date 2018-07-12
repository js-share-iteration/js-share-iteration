import React from 'react';

const Home = (props) => (
  <div className="container">
    <div className="jumbotron">
      <h1 className="display-4">Welcome to JS-Share!</h1>
      <p className="lead">The most advanced real time collaboration platform ever created.</p>
      <p className="lead">Utilizing Google & Github Authentication to verify all users, you will be able to access your own documents while also sharing documents with other users that have signed up.</p>
      <a
        className="btn btn-primary btn-lg"
        role="button"
        href="/auth/google"
      >
        Sign In With Google</a>
        <a
        className="btn btn-success btn-lg"
        role="button"
        href="/auth/github"
      >
        Sign In With Github</a>
    </div>
  </div>
);

export default Home;
