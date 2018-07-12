import React from 'react';


const File = props => (
  <div className="files">
    <a onClick={(event)=> {props.handleFileClick(props.index)} }href="#" role="button">
      {props.name}
    </a>
  </div>
);

export default File;
