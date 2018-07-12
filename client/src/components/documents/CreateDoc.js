import React from 'react';
import DocForm from './DocForm.js';

const CreateDoc = (props) => (
  <DocForm docId={null} mode={'create'} history={props.history} />
);

export default CreateDoc;

