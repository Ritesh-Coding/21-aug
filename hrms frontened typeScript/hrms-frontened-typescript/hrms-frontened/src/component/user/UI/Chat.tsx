import React, { useEffect, useState } from 'react'
// import useAxios from '../../../hooks/useAxios';
import { useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../types/types';
import appClient from '../../../network/AppClient';
import { Message } from '../../../types/user/UserInterface';
const Chat = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState<string>('')
    // const [employeeId,setEmployeeId]=useState(1)
    const chatSocket = useRef<WebSocket | null>(null);
    // const axiosInstance = useAxios()
    const { userId, firstName } = useSelector((state: RootState) => state.auth);
    let employeeId = userId
    useEffect(() => {
        appClient.get('http://127.0.0.1:8000/chat/')
            .then(response => {
                setMessages(response.data);
            });
    }, [])

    useEffect(() => {
        //connecting to the webSocket
        chatSocket.current = new WebSocket(
            'ws://127.0.0.1:8000/ws/chat/'
        );
        chatSocket.current.onmessage = function (e) {
            const data = JSON.parse(e.data);
            setMessages(prevMessages => [...prevMessages, data]);
        };
        chatSocket.current.onclose = function (e) {
            console.error('Chat socket closed unexpectedly');
        };
    }, [employeeId, userId])

    const handleSendMessage = () => {
        if (chatSocket.current) {
            chatSocket.current.send(JSON.stringify({
                'message': message,
                'employee_id': employeeId,
                'first_name': firstName
            }));
        }
        setMessage('');
    };
    return (
        <div>
            <textarea style={{ width: `1020px` }} readOnly value={messages.map(msg => `${msg.first_name}:: ${msg.message}`).join('\n')} cols={110} rows={20} />
            <br />
            <div style={{ display: `flex` }}>

                <div>
                    <input
                        type="text"
                        id="inputText"
                        placeholder='Enter your text here ...'
                        size={95}
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        onKeyUp={e => { if (e.key === 'Enter') handleSendMessage(); }}
                    />
                    <button onClick={handleSendMessage} className="btn btn-success">Send</button>
                </div>
            </div>
        </div>
    )
}

export default Chat