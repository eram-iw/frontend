import { useDisclosure } from '@chakra-ui/hooks'
import { ViewIcon } from '@chakra-ui/icons'
import { Button, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react'
import { userInfo } from 'os'
import React from 'react'

type ProfileModalProps = {
    user?: any,
    children?: React.ReactNode
}

function ProfileModal(props: ProfileModalProps) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <>
            {props.children ? (
                <span onClick={onOpen}>{props.children}</span>
            ) : (
                <IconButton bg='#121212' color='white'
                    _hover={{ color: 'black', bg: 'white' }} display={{ base: "flex" }} icon={<ViewIcon />}
                    onClick={onOpen}
                    aria-label={''}
                />
            )}
            <Modal size='lg' isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent h='410px'>
                    <ModalHeader
                        bg="RGBA(0, 0, 0, 0.99)"
                        borderColor='#3a3838'
                        color='gray.100'
                        fontSize="40px"
                        fontFamily='Work sans'
                        display='flex'
                        justifyContent='center'
                    >{props.user.name}</ModalHeader>
                    <ModalCloseButton color='white'/>
                    <ModalBody
                        display='flex'
                        flexDir='column'
                        alignItems='center'
                        justifyContent='space-between'
                        bg="rgba(32,33,36,255)"
                        borderColor='#3a3838'
                        color='gray.100'
                    >
                        <Image
                            borderRadius='full'
                            boxSize='150px'
                            src={props.user.pic}
                            alt={props.user.name}
                        />
                        <Text
                            fontSize={{ base: "28px", md: "30px" }}
                            fontFamily='Work sans'>
                            Email: {props.user.email}
                        </Text>
                    </ModalBody>

                    <ModalFooter bg="rgba(32,33,36,255)">
                        <Button bg='#2C7A7B' colorScheme='teal' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ProfileModal
