import { ViewIcon } from '@chakra-ui/icons'
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import axios from 'axios'
import React, { useState } from 'react'
import { ChatState } from '../../../context/chatProvider'
import UserBadgeItem from '../UserAvatar/UserBadgeItem'
import UserListItem from '../UserAvatar/UserListItem'

function UpdateGroupChatModal({ fetchAgain, setFetchAgain, fetchMessages }: any) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName, setGroupChatName] = useState('')
    const [selectedUsers, setSelectedUsers] = useState([])
    const [search, setSearch] = useState('')
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [renameLoading, setRenameLoading] = useState(false)

    const { user, selectedChat, setSelectedChat } = ChatState()

    const toast = useToast()

    const handleRemove = async (user1: any) => {

        if (selectedChat.groupAdmin._id !== user._id && user1.id !== user._id) {
            toast({
                title: "Only Admins can Remove someone!",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.put('api/chat/groupremove', {
                chatId: selectedChat._id,
                userId: user1._id
            },
                config
            )

            user1._id === user._id ? setSelectedChat() : setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            fetchMessages();
            setLoading(false)
        } catch (error) {
            toast({
                title: "Failed to Add the User!!!",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "bottom",
            });

        }

    }

    const handleAddUser = async (user1: any) => {
        if (selectedUsers.includes(user1)) {
            toast({
                title: "User Already Added in Group!",
                status: "warning",
                duration: 3000,
                isClosable: true,
                position: "top",
            });
            return;
        }
        if (selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: "Only Admins can Add in Group!",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top",
            });
            return;
        }
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.put('api/chat/groupadd', {
                chatId: selectedChat._id,
                userId: user1._id
            },
                config
            )
            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setLoading(false)
        } catch (error) {
            toast({
                title: "Failed to Add the User!!!",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "bottom",
            });

        }
    }

    const handleSearch = async (query: string) => {
        setSearch(query)
        if (!query) {
            return;
        }

        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.get(`/api/user?search=${search}`, config)
            setLoading(false)
            setSearchResult(data)
        } catch (error) {
            toast({
                title: "Error Occurred!!!",
                description: 'Failed to Load the Search Results',
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    }

    const handleRename = async () => {
        if (!groupChatName) return
        try {
            setRenameLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.put('/api/chat/rename',
                {
                    chatId: selectedChat._id,
                    chatName: groupChatName
                },
                config
            )
            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setRenameLoading(false)
        } catch (error) {
            toast({
                title: "Error Occurred!!!",
                description: 'Failed to Rename the Group',
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "bottom",
            });
            setRenameLoading(false)
        }
        setGroupChatName('')
    }

    return (
        <>
            <IconButton display={{ display: 'flex' }} onClick={onOpen} aria-label={''} icon={<ViewIcon />} />

            <Modal size='lg' isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent h='410px'>
                    <ModalHeader
                        fontSize="35px"
                        fontFamily='Work sans'
                        display='flex'
                        justifyContent='center'
                    >{selectedChat.chatName}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display="flex" flexDir="column" alignItems="center">
                        <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
                            <>
                                {selectedChat.users.map((u: any) => {
                                    return <UserBadgeItem
                                        key={u._id}
                                        user={u}
                                        admin={selectedChat.groupAdmin}
                                        handleFunction={() => handleRemove(u)}
                                    />
                                })}
                            </>
                        </Box>
                        <FormControl display='flex'>
                            <Input
                                placeholder='Name of Chat'
                                mb={3}
                                value={groupChatName}
                                onChange={(e: any) => setGroupChatName(e.target.value)}
                            />
                            
                        </FormControl>
                        <Button
                            variant='solid'
                            ml={1}
                            mb={3}
                            colorScheme='teal'
                            isLoading={renameLoading}
                            onClick={handleRename}
                        >
                            Update
                        </Button>
                        <FormControl>
                            <Input
                                placeholder='Add User to Group'
                                mb={1}
                                onChange={(e: any) => handleSearch(e.target.value)}
                            />
                        </FormControl>
                        {loading ? (
                            <Spinner size='lg' />
                        ) : (
                            searchResult?.slice(0, 4).map((user) => {
                                return (
                                    <UserListItem
                                        key={user._id}
                                        user={user}
                                        handleFunction={() => handleAddUser(user)}
                                    />
                                )
                            })
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='red' onClick={() => handleRemove(user)}>
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal></>
    )
}

export default UpdateGroupChatModal
