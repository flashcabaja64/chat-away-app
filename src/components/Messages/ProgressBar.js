import React from 'react';
import { Progress } from 'semantic-ui-react';

const ProgressBar = ({ uploadState, uploadProgress}) => {
  return (
    uploadState === 'uploading' && (
      <Progress
        className="progress_bar"
        percent={uploadProgress}
        progress
        indicating
        size="small"
        inverted
      />
    )
  )
}

export default ProgressBar;