import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import File from './File';

class EditDoc extends Component {
  constructor(props) {
    super(props);
    this.state = {
      init: false,
      console: '',
      files: [],
      index: 0,
      inputValue: '',
    };
    this.updateCode = this.updateCode.bind(this);
    this.runCode = this.runCode.bind(this);
    this.clearConsole = this.clearConsole.bind(this);
    this.saveCode = this.saveCode.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }
  handleFileClick = fileIndex => {
    this.setState({ index: fileIndex });
  };
  saveCode() {
    let docId = this.props.location.pathname.slice(9);
    axios
      .put(`/api/document/${docId}`, { docId, files: this.state.files })
      .then(res => {
        console.log('Success', res.data);
      })
      .catch(err => console.log(err));
  }

  clearConsole() {
    this.setState({
      console: '',
    });
  }

  updateCode(event) {
    let docId = this.props.location.pathname.slice(9);
    // socket broadcast to others
    // this.socket.emit('edit text', { docId, text: event.target.value });

    // set our own state
    this.state.files[this.state.index].text_content = event.target.value;
    this.setState({
      files: this.state.files,
    });
  }

  runCode() {
    try {
      const before = `
      const results = [];
      function logger(value) {results.push(value);};
      var console = {}; console.log = logger;
      const require = (path) => {
        console.log = () => {};
        const text = this.state.files.filter(obj => obj.name === path)[0].text_content;
        let module = {};
        eval(text)
        console.log = logger;
        return module.exports;
      };
    `;
      const after = '; results';
      const results = eval(before + this.state.files[0].text_content + after);

      let consoleText = this.state.console;
      results.forEach(result => {
        consoleText += result;
        consoleText += '\n';
      });
      this.setState({
        console: consoleText,
      });
    } catch (error) {
      this.setState({
        console: error,
      });
    }
  }
  handleKeyPress(e) {
    if (e.keyCode === 9) {
      e.preventDefault();
      let docId = this.props.location.pathname.slice(9);
      const tab = '  ';
      const tabbedInputValue = e.target.value + tab;
      this.state.files[this.state.index].text_content = tabbedInputValue;
      this.setState({
        files: this.state.files,
      });
    }
  }
  //-------------functionality for CREATE FILE FORM---------------//
  handleChange = event => {
    this.setState({ inputValue: event.target.value });
    console.log(this.state.inputValue);
  };
  handleCreateFileCancel = event => {
    event.preventDefault();
    this.setState({ inputValue: '' });
  };
  handleSubmit = event => {
    event.preventDefault();
    this.state.files.push({ name: this.state.inputValue, text_content: '' });
    this.setState({ files: this.state.files });
  };
  //--------------------------------------------------------------//
  componentDidMount() {
    let docId = this.props.location.pathname.slice(9);
    console.log(docId);
    
    // route protect against a bad docId
    if (parseInt(docId, 10).toString() !== docId)
      return this.props.history.push('/');
    
    // if docId make axios get request to server for docTitle and sharedUsers
    axios
      .get(`/api/document/${docId}`)
      .then(res => {
        this.setState({
          init: true,
          files: res.data,
        });

        console.log(this.state.files);

        // set up sockets
        // this.socket = io();
        // this.socket.on('connect', () => {
        //   // emit join doc on connect
        //   this.socket.emit('join doc', { docId });
        // });

        // // receive others' socket text broadcast event
        // this.socket.on('receive text', data => {
        //   this.setState({
        //     code: data.text
        //   });
        // });
      })
      .catch(err => {
        // not logged in with correct cookie
        console.log('error');
        console.log(err);
        console.log(typeof err);
        
        this.props.history.push('/');
      });
  }

  componentDidUpdate() {}

  componentWillUnmount() {
    // if no socket to close, then return
    // if (!this.socket) return;
    // let docId = this.props.location.pathname.slice(9);
    // this.socket.emit('leave doc', { docId });
  }

  render() {
    // let options = { lineNumbers: true, mode: 'javascript' };
    if (!this.state.init) return null;

    return (
      <div className="container">
        <div className="card-group">

        <div className="createFileForm">
          <div className="formCard">
          <form onSubmit={this.handleSubmit}>
            <input
              type="text"
              placeholder="add file here..."
              value={this.state.inputValue}
              onChange={this.handleChange}
            />
            <input class="btn" type="submit" value="Submit" />
            <button class="btn" onClick={this.handleCreateFileCancel}>Cancel</button>
          </form> <br/><br/>

        </div>

            <div className="displayFiles">Your Files</div>
            <div className="card-text-left">
              <div className="card-body">
                {/* <h5 className="card-title">{this.state.docTitle}</h5> */}
                {this.state.files.map((file, i) => (
                  <File key={i} index={i} handleFileClick={this.handleFileClick} name={file.name} />
                ))}
              </div>
            </div>
          </div>
          <div className="card1">
            <div className="card text-center">
              <div className="card-header">
                <ul className="nav nav-pills card-header-pills">
                  <li className="nav-item">
                    <Link className="nav-link disabled" to="/documents">
                      Cancel
                    </Link>
                  </li>
                  <li className="nav-item">
                    <button onClick={this.saveCode} className="nav-link active">
                      Save
                    </button>
                  </li>
                </ul>
              </div>
              <div className="card-body">
                <h5 className="card-title">{this.state.files[this.state.index].name}</h5>
              </div>
            </div>
            <div className="card-body">
              <h5 className="card-title">Enter Code Here</h5>
              <div className="card-text" rows="12">
                <textarea
                  className="form-control rounded-0"
                  style={{ fontFamily: 'monospace' }}
                  value={this.state.files[this.state.index].text_content}
                  onChange={this.updateCode}
                  id="DocText"
                  rows="10"
                  onKeyDown={e => this.handleKeyPress(e)}
                />
              </div>
            </div>
          </div>
          <div className="card2">
            <div className="card text-center">
              <div className="card-header">
                <ul className="nav nav-pills card-header-pills">
                  <li className="nav-item">
                    <button onClick={this.clearConsole} className="nav-link disabled">
                      Clear
                    </button>
                  </li>
                  <li className="nav-item">
                    <button onClick={this.runCode} className="nav-link active">
                      Run
                    </button>
                  </li>
                </ul>
              </div>
              <div className="card-body">
                <h5 className="card-title">Console</h5>
              </div>
            </div>
            <div className="card-body">
              <h5 className="card-title">JS</h5>
              <div className="card-text" rows="12">
                <textarea
                  className="form-control rounded-0"
                  style={{ fontFamily: 'monospace' }}
                  value={this.state.console}
                  id="ConsoleOutput"
                  rows="10"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EditDoc;
