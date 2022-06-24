import React, { useEffect, useState } from 'react'
import { ChatState } from '../context/chatProvider'
import { Box, Stack, Text, useToast } from '@chakra-ui/react'
import { Button } from '@chakra-ui/button'
import axios from 'axios'
import { AddIcon } from '@chakra-ui/icons'
import ChatLoading from './ChatLoading'
import { getSender } from '../config/chatLogics'
import GroupChatModal from './Authentication/miscellaneous/GroupChatModal'

function MyChats({ fetchAgain }:any) {
  const [loggedUser, setLoggedUser] = useState()
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState()

  const toast = useToast()

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        }
      }

      const { data } = await axios.get("/api/chat", config)
      setChats(data)
    } catch (error: any) {
      toast({
        title: "Error Occurred!!!",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  }

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")))
    fetchChats();
  }, [fetchAgain])

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems='center'
      p={3}
      bg="rgba(32,33,36,255)"
      w={{ base: "100%", md: "31%" }}
      borderRadius='lg'
      borderColor='#3a3838'
      borderWidth='1px'
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display='flex'
        w='100%'
        justifyContent='space-between'
        alignItems='center'
        color='gray.100'
      >
        My Chats
        <GroupChatModal>
          <Button
            display='flex'
            color='gray.900'
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon color='gray.900'/>}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="gray.900"
        w="100%"
        borderRadius='lg'
        overflowY='scroll'
      >
        {chats ? (
          <Stack overflowY='scroll'>
            {chats.map((chat: any) => {
              return (
                <Box
                  onClick={() => setSelectedChat(chat)}
                  cursor='pointer'
                  bg={selectedChat === chat ? "#2C7A7B" : "rgb(232 232 232)"}
                  color={selectedChat === chat ? "white" : "rgba(32,33,36,255)"}
                  px={3}
                  py={2}
                  borderRadius='lg'
                  key={chat._id}
                >
                  <Text>
                    {!chat.isGroupChat
                      ? (
                        getSender(loggedUser, chat.users)
                      ) : (chat.chatName)}
                  </Text>
                </Box>
              )
            })}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  )
}

export default MyChats
