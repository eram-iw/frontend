import { ArrowBackIcon } from '@chakra-ui/icons'
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { getSender, getSenderFull } from '../config/chatLogics'
import { ChatState } from '../context/chatProvider'
import ProfileModal from './Authentication/miscellaneous/ProfileModal'
import UpdateGroupChatModal from './Authentication/miscellaneous/UpdateGroupChatModal'
import '../components/Styles.css'
import ScrollableChat from './ScrollableChat'

function SingleChat({ fetchAgain, setFetchAgain }: any) {

    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [newMessage, setNewMessage] = useState('')
    const { user, selectedChat, setSelectedChat } = ChatState()

    const toast = useToast()



    const sendMessage = async (e: any) => {
        if (e.key === "Enter" && newMessage) {
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${user.token}`,
                    }
                }

                setNewMessage('')

                const { data } = await axios.post("/api/message", {
                    content: newMessage,
                    chatId: selectedChat._id
                }
                    ,
                    config
                )
                console.log(data);

                setMessages([...messages, data])
            } catch (error: any) {
                toast({
                    title: "Error Occurred!!!",
                    description: 'Failed to send the Message!',
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                    position: "bottom",
                });
            }
        }
    }



    const fetchMessages = async () => {
        if (!selectedChat) return
        try {
            const config = {
                headers: {
                    "Authorization": `Bearer ${user.token}`,
                }
            }
            setLoading(true)
            const { data } = await axios.get(`/api/message/${selectedChat._id}`,
                config
            )
            console.log(messages);
            setMessages(data)
            setLoading(false)
        } catch (error: any) {
            toast({
                title: "Error Occurred!!!",
                description: 'Failed to Load the Message!',
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "bottom",
            });
        }
    }

    useEffect(() => {
        fetchMessages()
    }, [selectedChat])

    const typingHandler = (e: any) => {
        setNewMessage(e.target.value)
        // Typing Indicator Logic
    }

    return (
        <>
            {selectedChat ?
                <>
                    <Text
                        fontSize={{ base: '28px', md: "30px" }}
                        pb={3}
                        px={2}
                        w="100%"
                        fontFamily="Work sans"
                        display='flex'
                        justifyContent={{ base: 'space-between' }}
                        alignItems="center"
                    >
                        <IconButton
                            display={{ base: 'flex', md: "none" }} aria-label={''}
                            icon={<ArrowBackIcon />}
                            onClick={() => setSelectedChat('')}
                        />
                        {!selectedChat.isGroupChat ? (
                            <>
                                {getSender(user, selectedChat.users)}
                                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                            </>
                        ) : (
                            <>
                                {selectedChat.chatName.toUpperCase()}
                                <UpdateGroupChatModal
                                    fetchAgain={fetchAgain}
                                    setFetchAgain={setFetchAgain}
                                    fetchMessages={fetchMessages}
                                />
                            </>
                        )}

                    </Text>
                    <Box
                        display='flex'
                        flexDir='column'
                        justifyContent='flex-end'
                        p={3}
                        bg="#e8e8e8"
                        w="100%"
                        h="100%"
                        borderRadius='lg'
                        overflowY='hidden'
                    >
                        {/* Messages */}
                        {loading ?
                            <Spinner
                                size="xl"
                                w={20}
                                h={20}
                                alignSelf='center'
                                margin='auto'
                            />
                            :
                            <div className='messages'>
                                <ScrollableChat messages={messages}/>
                            </div>
                        }
                        <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                            <Input
                                variant='filled'
                                bg="#e0e0e0"
                                placeholder="Enter a Message..."
                                onChange={typingHandler}
                                value={newMessage}
                            />
                        </FormControl>
                    </Box>
                </>
                :
                <Box
                    display="flex"
                    alignItems='center'
                    justifyContent='center'
                    h="100%"
                >
                    <Text
                        fontSize='3xl' pb={3} fontFamily="Work sans"
                    >Click on a User to Start Chatting</Text>
                </Box>}
        </>
    )
}

export default SingleChat
