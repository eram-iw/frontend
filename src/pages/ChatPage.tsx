import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { ChatState } from '../context/chatProvider'
import { Box } from '@chakra-ui/react'
import SideDrawer from '../components/Authentication/miscellaneous/SideDrawer'
import MyChats from '../components/MyChats'
import ChatBox from '../components/ChatBox'

function ChatPage() {
    const {user}= ChatState()
        
    return (
        <div style={{width:'100%'}}>
            {user && <SideDrawer/>}
            <Box
            display="flex"
            justifyContent="space-between"
            w='100%'
            h='91.5vh'
            p='10px'
            >
                {user && <MyChats/>}
                {user && <ChatBox/>}
            </Box>
        </div>
    )
}

export default ChatPage
