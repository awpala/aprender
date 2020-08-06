import React from 'react';

const NotFound = (props) => {
    return (
        <div>
            <p>Invalid page reached :(</p>
            <button
                className="invalid-btn"
                onClick={() => props.history.push('/')}
            >
                Return to Home
            </button>
        </div>
    )
}

export default NotFound;