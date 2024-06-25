import React, { useEffect, useState } from 'react'
import { Box, VStack } from '@chakra-ui/react'
import Dashboard from '@/components/DashBoard'
import Header from '@/components/ui/Header'
import Footer from '@/components/Footer'
import Cookies from 'js-cookie'

const UserDashBoard = () => {

  return (
    <VStack minHeight="100vh" spacing={0}>
      <Header />
      <Box flex={1} width="100%" maxWidth="1200px" margin="0 auto" padding={4}>
        <Dashboard />
      </Box>
      <Footer />
    </VStack>
  )
}

export default UserDashBoard