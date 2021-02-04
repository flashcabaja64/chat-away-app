import React from 'react';

export default function ValidationError({message}) {
  const validationStyle = {
    'color':'red',
    'fontSize': '1em',
    'marginTop': '-10px',
    'marginBottom': '10px',
    'textAlign': 'left'
  }

  if(message) {
    return (
      <div className="error" style={validationStyle}>{message}</div>
    )
  }
  return <></>
}