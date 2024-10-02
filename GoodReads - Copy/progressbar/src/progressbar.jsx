import React from 'react'

const progressbar = ({progress}) => {
    const styleObject ={
        width: `${progress}%`,
        backgroundColor: 'brown',
        height: 20,
        borderRadius: 20
    }
  return (
    <div className="container">
      <div className="progress-bar">
        <div style={styleObject}>
            {`${progress}`}
        </div>
      </div>
    </div>
  )
}

export default progressbar
