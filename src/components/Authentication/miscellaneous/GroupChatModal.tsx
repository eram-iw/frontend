import { Box, FormControl, Input, useDisclosure, useToast } from '@chakra-ui/react'
import { Button, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react'
import axios from 'axios'
import React, { useState } from 'react'
import { ChatState } from '../../../context/chatProvider'
import UserBadgeItem from '../UserAvatar/UserBadgeItem'
import UserListItem from '../UserAvatar/UserListItem'

function GroupChatModal({ children }: any) {
    const { isOpen, onOpen, onClose } = useDisclosure()

    const [groupChatName, setGroupChatName] = useState()
    const [selectedUsers, setSelectedUsers] = useState([])
    const [search, setSearch] = useState('')
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)

    const toast = useToast()

    const { user, chats, setChats } = ChatState()

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

    const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers) {
            toast({
                title: "Please Fill all the Details!",
                status: "warning",
                duration: 3000,
                isClosable: true,
                position: "top",
            });
        }
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.post('api/chat/group', {
                name: groupChatName,
                users: JSON.stringify(selectedUsers.map((u) => u._id)),
            },
                config
            )

            setChats([data, ...chats])
            onClose()
            toast({
                title: "Group Chat Created!",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "bottom",
            });
        } catch (error) {
            toast({
                title: "Failed to Create the Group Chat!!!",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "bottom",
            });
        }
    }

    const handleGroup = (userToAdd: any) => {
        if (selectedUsers.includes(userToAdd)) {
            toast({
                title: "User Already Added!",
                status: "warning",
                duration: 3000,
                isClosable: true,
                position: "top",
            });
            return;
        }
        setSelectedUsers([...selectedUsers, userToAdd])
    }

    const handleDelete = (userToDelete: any) => {
        setSelectedUsers(selectedUsers.filter(sel => sel._id !== userToDelete._id))
    }

    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal size='lg' isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent h='410px'>
                    <ModalHeader
                        fontSize="35px"
                        fontFamily='Work sans'
                        display='flex'
                        justifyContent='center'
                        bg="RGBA(0, 0, 0, 0.99)"
                        borderColor='#3a3838'
                        color='gray.100'
                    >Create Group Chat
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display='flex'
                        flexDir='column'
                        alignItems='center'
                        bg="rgba(32,33,36,255)"
                        borderColor='#3a3838'
                        color='gray.100'
                        pt={8}                        
                    >
                        <>
                            <FormControl>
                                <Input
                                    bg="rgba(32,33,36,255)"
                                    borderColor='#3a3838'
                                    color='white'
                                    placeholder='Name of Chat'
                                    mb={5}
                                    onChange={(e: any) => setGroupChatName(e.target.value)} />
                            </FormControl>
                            <FormControl>
                                <Input
                                    bg="rgba(32,33,36,255)"
                                    borderColor='#3a3838'
                                    color='white'
                                    placeholder='Add Users'
                                    mb={3}
                                    onChange={(e: any) => handleSearch(e.target.value)} />
                            </FormControl>
                            {/* selected users */}
                            <Box w='100%' display='flex' flexWrap='wrap'>
                                <>
                                    {selectedUsers.map((u) => {
                                        return <UserBadgeItem
                                            key={u._id}
                                            user={u}
                                            handleFunction={() => handleDelete(u)}
                                        >
                                        </UserBadgeItem>
                                    })}
                                </>
                            </Box>

                            {/* renders search users */}
                            {loading ? <div>Loading...</div>
                                : (
                                    searchResult?.slice(0, 4).map((user) => <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} />
                                    )
                                )}
                        </>
                    </ModalBody>

                    <ModalFooter bg='rgba(32,33,36,255)'>
                        <Button colorScheme='teal' bg="#2C7A7B" mb={10} mr={3} onClick={handleSubmit}>
                            Create Chat
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal></>
    )
}

export default GroupChatModal