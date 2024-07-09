import React from 'react'

const Input = ({message,setMessage,sendMessage}) => {
    return (
        <form action="" className="form">
            <input className='input' placeholder='Type a message...' type="text" value={message}
                onChange={(event) => setMessage(event.target.value)}
                onKeyPress={(event) =>
                    event.key === 'Enter' ? sendMessage(event) : null
                } />
            <button className='sendButton' onClick={(event) => sendMessage(event)}>Send</button>
        </form>
    )
}

export default Input
