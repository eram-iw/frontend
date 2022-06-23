import { Avatar, Box, Text } from '@chakra-ui/react'
import React from 'react'

function UserListItem({user, handleFunction }: any) {
    return (
        <Box
            onClick={()=>handleFunction()}
            cursor='pointer'
            bg='RGBA(0, 0, 0, 0.80)'
            color='RGBA(255, 255, 255, 0.70)'
            _hover={{
                background: '#285E61',
                color: 'white'
            }}
            w='100%'
            display='flex'
            alignItems='center'
            px={3}
        >
            <Avatar
                mr={2}
                size='sm'
                cursor='pointer'
                name={user.name}
                src={user.pic}
            />
            <Box>
                <Text>{user.name}</Text>
                <Text fontSize='xs'>
                    <b>Email : </b>{user.email}
                </Text>
            </Box>
        </Box>
    )
}

export default UserListItem
