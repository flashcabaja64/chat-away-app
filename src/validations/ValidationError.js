import React from 'react';

export default function ValidationError({ message, submitError }) {
  const validationStyle = {
    'color':'red',
    'fontSize': '1em',
    'marginTop': '-10px',
    'marginBottom': '10px',
    'textAlign': 'left'
  }

  const submitStyle = {
    'color':'red',
    'fontSize': '1em',
    'marginTop': '0.3em',
    'textAlign': 'center'
  }

  if(message && !submitError) {
    return (
      <div className="error" style={validationStyle}>{message}</div>
    )
  } else {
    return (
      <div className="error" style={submitStyle}>{message}</div>
    )
  }
  return <></>
}