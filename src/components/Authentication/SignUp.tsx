import React, { useState } from 'react'
import { VStack } from "@chakra-ui/layout"
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input"
import { FormControl, FormLabel } from "@chakra-ui/form-control"
import { Button } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function SignUp() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [pic, setPic] = useState('')
    const [show, setShow] = useState(false)
    const [loading, setLoading] = useState(false)

    const toast = useToast()

    const navigate = useNavigate()


    const postDetails = (pics: any) => {
        setLoading(true);
        if (pics === undefined) {
            toast({
                title: 'Please select an image.',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
            return;
        }
        if (pics.type === "image/jpeg" || pics.type === "image/png") {
            const data = new FormData();
            data.append("file", pics)
            data.append("upload_preset", "chat-app")
            data.append("cloud_name", "eram-iw")
            fetch("https://api.cloudinary.com/v1_1/eram-iw/image/upload", {
                method: "POST",
                body: data
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log(data);
                    setPic(data.url.toString())
                    setLoading(false)
                })
                .catch((err) => {
                    console.log(err);
                    setLoading(false)
                })
        }
        else {
            toast({
                title: 'Please select an Image!',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            })
            setLoading(false)
            return;
        }
    }
    const subMitHandler = async () => {
        setLoading(true);
        if (!name || !email || !password || !confirmPassword) {
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

        if (password !== confirmPassword) {
            toast({
                title: 'Passwords Do Not Match!',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            })
            return;
        }
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                }
            }
            const { data } = await axios.post("/api/user", { name, email, password, pic }, config)
            toast({
                title: 'Registration Successful!',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            })

            localStorage.setItem('userInfo', JSON.stringify(data))
            setLoading(false)
            navigate('/chats')
        } catch (err:any) {
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
            <FormControl id='first-name' isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                    value={name}
                    placeholder='Enter Your Name'
                    onChange={(e) => setName(e.target.value)}
                />
            </FormControl>
            <FormControl id='signupemail' isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    value={email}
                    placeholder='Enter Your Email'
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>
            <FormControl id='signuppassword' isRequired>
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
            <FormControl id='confirm-password' isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                    <Input
                        value={confirmPassword}
                        type='password'
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <InputRightElement width='4.4rem'>
                        <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <FormControl id='pic' isRequired>
                <FormLabel>Upload Your Picture</FormLabel>

                <Input
                    type='file'
                    p={1.5}
                    accept="image/*"
                    onChange={(e) => postDetails(e.target.files[0])}
                />
            </FormControl>
            <Button
                colorScheme="blue"
                width="100%"
                style={{ marginTop: 15 }}
                onClick={subMitHandler}
                isLoading={loading}
            >Sign Up</Button>
        </VStack>
    )
}

export default SignUp
