import React, { useState } from 'react'
import { VStack } from "@chakra-ui/layout"
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input"
import { FormControl, FormLabel } from "@chakra-ui/form-control"
import { Button } from '@chakra-ui/react'

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [show, setShow] = useState(false)

   
    const subMitHandler = () => {

    }
    return (
        <VStack spacing='5px'>
           
            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                value={email}
                    placeholder='Enter Your Email'
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>
            <FormControl id='password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                    value={password}
                        type='password'
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement width='4.4rem'>
                        <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
           
            <Button
                colorScheme="blue"
                width="100%"
                style={{ marginTop: 15 }}
                onClick={subMitHandler}
            >Log In!</Button>

            <Button
            variant="solid"
                colorScheme="red"
                width="100%"
                onClick={()=>{
                    setEmail('guest@example.com')
                    setPassword('123456')
                }}
            >Get Guest User Credentials!</Button>
        </VStack>
    )
}

export default Login
