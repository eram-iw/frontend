import { Box } from '@chakra-ui/react'
import React from 'react'
import { ChatState } from '../context/chatProvider'
import SingleChat from './SingleChat'

function ChatBox({ fetchAgain, setFetchAgain }:any) {
  const { selectedChat } = ChatState()
  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems='center'
      flexDir='column'
      p={3}
      bg="rgba(32,33,36,255)"
      borderColor='#3a3838'
      color='gray.100'
      w={{base:"100%",md:"68%"}}
      borderRadius="lg"
      borderWidth='1px'
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  )
}

export default ChatBox
