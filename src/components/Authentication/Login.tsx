import React, { useState } from 'react'
import { VStack } from "@chakra-ui/layout"
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input"
import { FormControl, FormLabel } from "@chakra-ui/form-control"
import { Button } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [show, setShow] = useState(false)
    const [loading, setLoading] = useState(false)

    const toast = useToast()

    const navigate = useNavigate()


    const subMitHandler = async () => {
        setLoading(true);
        if (!email || !password) {
            toast({
                title: 'Please Fill all the Fields!',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            })
            setLoading(false)
            return;
        }
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                }
            }
            const { data } = await axios.post("/api/user/login", { email, password }, config)
            toast({
                title: 'Login Successfull!!!',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            })
            localStorage.setItem('userInfo', JSON.stringify(data))
            setLoading(false)
            navigate('/chats')
            window.location.reload();

        } catch (err: any) {
            toast({
                title: 'Some Error Occured!!!',
                description: err.response.data.message,
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            })
            setLoading(false)
        }

    }
    return (
        <VStack spacing='5px'>

            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    borderColor='#3a3838'
                    value={email}
                    placeholder='Enter Your Email'
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>
            <FormControl id='password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                        borderColor='#3a3838'
                        value={password}
                        type={show ? 'text' : 'password'}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement width='4.4rem'>
                        <Button
                            background='#444343'
                            h="1.75rem"
                            _hover={{ color: '#444343', bg: 'white' }}
                            size="sm"
                            onClick={() => setShow(!show)}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <Button
                colorScheme="gray"
                _hover={{ bg: '#444343', color: 'white' }}
                color='#444343'
                width="100%"
                style={{ marginTop: 15 }}
                onClick={subMitHandler}
                isLoading={loading}
            >Log In!</Button>

            <Button
                variant="solid"
                color='white'
                background='red.800'
                _hover={{ bg: 'white', color: 'red.800' }}
                width="100%"
                onClick={() => {
                    setEmail('guest@example.com')
                    setPassword('123456')
                }}
            >Get Guest User Credentials!</Button>
        </VStack>
    )
}

export default Login
