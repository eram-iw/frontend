import React, { useEffect, useState } from 'react'
import { Container, Box, Text, Tabs, Tab, TabList, TabPanel, TabPanels } from '@chakra-ui/react'
import Login from '../components/Authentication/Login'
import SignUp from '../components/Authentication/SignUp'
import { useNavigate } from 'react-router-dom'

function HomePage() {
  const navigate = useNavigate()

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"))

    if (!userInfo) {
      navigate('/chats')
    }
  }, [navigate])
  return (
    <Container maxW='xl' centerContent justifyContent='center'>
      <Box
        display="flex"
        justifyContent="center"
        p={3}
        bg="#1a1a1a"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderColor='#3a3838'
        borderWidth="1px"
      >
        <Text fontSize='4xl' fontFamily="Work Sans" color="#c0c9cd">Chat Application</Text>
      </Box>
      <Box bg="#1a1a1a" w="100%" p={4} borderRadius="lg" borderWidth="1px" color="#c0c9cd" borderColor='#3a3838'>
        <Tabs variant='soft-rounded'>
          <TabList mb="1em">
            <Tab _selected={{ color: '#E2E8F0', bg: '#444343' }} width='50%'>Login</Tab>
            <Tab _selected={{ color: '#E2E8F0', bg: '#444343' }} width='50%'>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel><Login/></TabPanel>
            <TabPanel><SignUp/></TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default HomePage
