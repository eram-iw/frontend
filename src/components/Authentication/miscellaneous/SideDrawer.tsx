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
import '../../../App.css'
import { getSender } from '../../../config/chatLogics';
//@ts-ignore
import NotificationBadge from 'react-notification-badge';
//@ts-ignore
import { Effect } from 'react-notification-badge';

function SideDrawer() {
    const [search, setSearch] = useState('')
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingChat, setLoadingChat] = useState(false)

    const { user, setSelectedChat, chats, setChats, notification, setNotification } = ChatState()


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
                color='gray.300'
                _hover={{ color: "#1a1a1a" }}
                w="100%"
                p="10px 10px 2px 10px"
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
                        <MenuButton p={1} _hover={{ color: 'red.100' }}>
                            <NotificationBadge
                            count={notification.length}
                            effect={Effect.SCALE}
                            />
                            <BellIcon fontSize='2xl' m={1} />
                        </MenuButton>
                        <MenuList pl={3}>
                            <>
                                {!notification.length && 'No new Messages'}
                                {notification.map((notif: any) => {
                                    return (
                                        <MenuItem
                                        onClick={()=>{
                                            setSelectedChat(notif.chat)
                                            setNotification(notification.filter((n:any)=>n!== notif))
                                        }}
                                            key={notif._id}>
                                            {notif.chat.isGroupChat ?
                                                `New Message in ${notif.chat.chatName}`
                                                :
                                                `New Message from ${getSender(user, notif.chat.users)}`}
                                        </MenuItem>
                                    )
                                })}
                            </>
                        </MenuList>
                    </Menu>
                    <Menu >
                        <MenuButton bg='RGBA(0, 0, 0, 0.64)' _hover={{ color: 'red.100' }}
                            as={Button}
                            rightIcon={<ChevronDownIcon />}
                        >
                            <Avatar size='sm' cursor='pointer' name={user.name} src={user.pic} />
                        </MenuButton>
                        <MenuList bg="gray.900" 
                            borderColor='#3a3838'
                        >
                            <ProfileModal user={user}>
                                <MenuItem borderRadius='8px' ml={3} w='90%'  bg='#75767a'>My Profile</MenuItem>
                            </ProfileModal>
                            <MenuDivider />
                            <MenuItem borderRadius='8px' ml={3} w='90%' bg='#75767a' onClick={logOutHandler}>Log Out</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>

            <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth='1px' bg='black' color='gray.300'> Search Users</DrawerHeader>
                    <DrawerBody bg='gray.900' color='gray.300'>
                        <>
                            <Box display='flex' pb={2} >
                                <Input
                                    borderColor='#3a3838'
                                    placeholder='Seach by email or name'
                                    mr={2}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <Button colorScheme="gray"
                                    _hover={{ bg: 'gray.900', color: 'white' }}
                                    color='#444343'
                                    onClick={handleSearch}>Go</Button>
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
                            {loadingChat && <Spinner ml="auto" display='flex' />}
                        </>
                    </DrawerBody>
                </DrawerContent>

            </Drawer>
        </>
    )
}

export default SideDrawer
