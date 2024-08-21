import { useState, useEffect, useRef } from "react";
import React from "react";
import { useSelector } from "react-redux";
// import useAxios from "../../../hooks/useAxios";
import appClient from "../../../network/AppClient";
import { RootState } from "../../../types/types";
import { EmployeeChatPropType } from "../../../types/user/UserInterface";
import { MessageType } from "../../../types/user/UserInterface";

const EmployeeChat : React.FC<EmployeeChatPropType> = ({ recipientId }) => {
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [message, setMessage] = useState<string>('');
    const chatSocket = useRef<WebSocket | null>(null);
    const { userId,firstName } = useSelector((state:RootState) => state.auth);
    // const axiosInstance = useAxios()
    useEffect(()=>{
        appClient.get('http://127.0.0.1:8000/messages/')
        .then(response => {
            setMessages(response.data);
        });
    },[userId,recipientId])
   
    useEffect(() => {
        // connecting to the WebSocket
        chatSocket.current = new WebSocket(
            `ws://127.0.0.1:8000/ws/chatting/${recipientId}/${userId}/`
        );
        chatSocket.current.onmessage = function(e) {
            const data : MessageType = JSON.parse(e.data);
         
            if (data.senderId === userId || data.recipientId === userId) {
                setMessages(prevMessages => [...prevMessages, data]);
            }
        };
        chatSocket.current.onclose = function(e) {
            console.error('Chat socket closed unexpectedly');
        };
    }, [recipientId, userId]);

    const handleSendMessage = () => {
        if (chatSocket.current)
        {
            chatSocket.current.send(JSON.stringify({
                'message': message,
                'senderId': userId,
                'recipientId': recipientId,
                'first_name' : firstName
            }));
            
        }
        setMessage('');
    };
    return (
        <div>         
            <textarea
             style={{ width: '300px' }}
             readOnly
            value={messages.map(msg => `${msg.senderId === userId ? firstName : msg.first_name}: ${msg.message}`).join('\n')} 
             cols = {30}
             rows={5} />
            <br />
            <div style={{ display: `flex` }}>
                <input
                    type="text"
                    id="inputText"
                    placeholder='Enter your text here ...'
                    size={22}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    onKeyUp={e => { if (e.key === 'Enter') handleSendMessage(); }}
                />
                <button onClick={handleSendMessage} className="btn btn-success">Send</button>
            </div>
        </div>
    );
};

export default EmployeeChat;