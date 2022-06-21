import { ArrowBackIcon } from '@chakra-ui/icons'
import { Box, IconButton, Text } from '@chakra-ui/react'
import React from 'react'
import { getSender, getSenderFull } from '../config/chatLogics'
import { ChatState } from '../context/chatProvider'
import ProfileModal from './Authentication/miscellaneous/ProfileModal'
import UpdateGroupChatModal from './Authentication/miscellaneous/UpdateGroupChatModal'

function SingleChat({ fetchAgain, setFetchAgain }: any) {
    const { user, selectedChat, setSelectedChat } = ChatState()

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
                                <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}
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
                        Messages
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
