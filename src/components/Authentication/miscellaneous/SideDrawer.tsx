import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Tooltip } from '@chakra-ui/react'
import { Text } from '@chakra-ui/layout'
import React, { useState } from 'react'
import 'font-awesome/css/font-awesome.min.css';
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { ChatState } from '../../../context/chatProvider';
import ProfileModal from './ProfileModal';
import { useNavigate } from 'react-router-dom';
import { useDisclosure } from '@chakra-ui/hooks'
import { useToast } from '@chakra-ui/react'
import axios from 'axios';
import ChatLoading from '../../ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';

function SideDrawer() {
    const [search, setSearch] = useState('')
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingChat, setLoadingChat] = useState(false)

    const { user, setUser, selectedChat, setSelectedChat, chats, setChats } = ChatState()


    const navigate = useNavigate()

    const { isOpen, onOpen, onClose } = useDisclosure()

    const toast = useToast()

    const logOutHandler = () => {
        localStorage.removeItem("userInfo")
        navigate('/')
    }

    const handleSearch = async () => {
        if (!search) {
            toast({
                title: "Nothing Entered to Search!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-left"
            })
        }
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.get(`/api/user?search=${search}`, config)
            if (data) {
                setLoading(false)
                setSearchResult(data)
            }

        } catch (error) {
            toast({
                title: "Error Occured!!!",
                description: 'Failed to Load the Search Results',
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left"
            })
        }
    }

    const accessChat = async (userId: any) => {
        try {
            setLoadingChat(true);
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post(`/api/chat`, { userId }, config);
            if (!chats.find((c: any) => c._id === data._id)) setChats([data, ...chats]);
            setSelectedChat(data);
            setLoadingChat(false);
            onClose();
        }
        catch (error: any) {
            toast({
                title: "Error fetching the chat",
                description: error.message,
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    }

    return (
        <>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                bg="white"
                w="100%"
                p="5px 10px 5px 10px"
                borderWidth="5px"
            >
                <Tooltip
                    label='Search Users to start Chatting'
                    hasArrow
                    placement='bottom-end'
                >
                    <Button
                        variant='ghost'
                        onClick={onOpen}
                    >
                        <i className='fa fa-search'></i>
                        <Text
                            display={{
                                base: "none", md: 'flex'
                            }}
                            px="4"
                        >Search User</Text>
                    </Button>
                </Tooltip>
                <Text fontSize='2xl' fontFamily='Work sans'>Chat Application</Text>
                <div>
                    <Menu>
                        <MenuButton p={1}>
                            <BellIcon fontSize='2xl' m={1} />
                        </MenuButton>
                    </Menu>
                    <Menu>
                        <MenuButton
                            as={Button}
                            rightIcon={<ChevronDownIcon />}
                        >
                            <Avatar size='sm' cursor='pointer' name={user.name} src={user.pic} />
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user={user}>
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModal>
                            <MenuDivider />
                            <MenuItem onClick={logOutHandler}>Log Out</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>

            <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth='1px'> Search Users</DrawerHeader>
                    <DrawerBody>
                        <>
                            <Box display='flex' pb={2}>
                                <Input
                                    placeholder='Seach by email or name'
                                    mr={2}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <Button onClick={handleSearch}>Go</Button>
                            </Box>
                            {loading ? (
                                <ChatLoading />
                            ) : (

                                searchResult.map(user => {
                                    return <UserListItem
                                        key={user._id}
                                        user={user}
                                        handleFunction={() => accessChat(user._id)}
                                    />
                                })
                            )}
                            {loadingChat && <Spinner ml="auto" display='flex'/>}
                        </>
                    </DrawerBody>
                </DrawerContent>

            </Drawer>
        </>
    )
}

export default SideDrawer
