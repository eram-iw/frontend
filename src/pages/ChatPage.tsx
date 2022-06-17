import React, { useEffect, useState } from 'react'
import axios from 'axios'

function ChatPage() {
    const [chats, setChats] = useState([])

    useEffect(() => {
        fetchChats()
    }, [])

    const fetchChats = async () => {
        const { data } = await axios.get('/api/chat')
        setChats(data)
    }

    return (
        <>
            {console.log(chats)}
            {chats.map((val: any) => {
                const { users } = val
                return (
                    <div key={val._id}>
                        <p>ID: {val._id}</p>
                        <p>Group Chat: {val.isGroupChat + ""}</p>
                        <p>Chat Name: {val.chatName + ""}</p>
                        {users.map((user:any,id:number)=>{
                            return(<div key={id}>
                            <p>Name{id+1}: {user.name}</p>
                            <p>Email{id+1}: {user.email}</p>
                            </div>)                            
                        })}
                        <br/>
                        <p>******************************</p>
                        <br/>
                    </div>
                )
            })}
        </>
    )
}

export default ChatPage
