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
                <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} aria-label={''} />
            )}
            <Modal  size='lg' isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent h='410px'>
                    <ModalHeader
                    fontSize="40px"
                    fontFamily='Work sans'
                    display='flex'
                    justifyContent='center'
                    >{props.user.name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                    display='flex'
                    flexDir='column'
                    alignItems='center'
                    justifyContent='space-between'
                    >
                        <Image 
                        borderRadius='full'
                        boxSize='150px'
                        src={props.user.pic}
                        alt={props.user.name}
                        />
                        <Text
                        fontSize={{base:"28px", md:"30px"}}
                        fontFamily='Work sans'>
                            Email: {props.user.email}
                        </Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ProfileModal
