import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Image,
  Text,
  Icon,
  Heading,
  Flex,
  ChakraProvider,
  useToast,
} from '@chakra-ui/react';
import { EmailIcon, LockIcon, InfoIcon } from '@chakra-ui/icons';
import signupimage from '../assets/algosprint_login.jpg';
import sprintlogo from '../assets/algosprint_logo.jpeg';
import wavy from '../assets/algosprint_back.jpg';
import Cookies from 'js-cookie';

const Login = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [formErrors, setFormErrors] = useState({
    username: '',
    password: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateFormData = () => {
    const errors = {
      username: '',
      password: '',
    };

    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    }

    if (!formData.password.trim()) {
      errors.password = 'Password is required';
    }

    setFormErrors(errors);

    // Return true if there are no errors
    return Object.values(errors).every((error) => !error);
  };

  const loginUser = async () => {
    try {
      const response = await fetch(`http://localhost:2999/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || 'Login failed');
      }

      toast({
        title: 'Login Successful',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      const result = await response.json();
      Cookies.set('authToken', result.token, { expires: 0.24 });
      navigate('/home');
    } catch (error) {
      console.error('Error during login:', error.message);
      toast({
        title: 'Login Failed',
        description: error.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsSubmitting(true);

    setFormErrors({
      username: '',
      password: '',
    });

    const isFormValid = validateFormData();

    if (isFormValid) {
      await loginUser();
      setFormData({
        username: '',
        password: '',
      });
      setIsSubmitting(false);
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <ChakraProvider>
      <Box display="flex" height="100vh" flexDirection={{ base: 'column', md: 'row' }}>
        <Box flex="1" position="relative">
          <Image src={signupimage} alt="Login Image" objectFit="cover" width="100%" height="100%" />
          <Box
            position="absolute"
            top="0"
            left="0"
            width="100%"
            height="100%"
            bg="rgba(0, 0, 0, 0.5)"
            color="white"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            padding="2rem"
          >
            
          </Box>
        </Box>
        <Box
          flex="1"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          padding="2rem"
        >
          {/* <Image src={sprintlogo} alt="Logo" boxSize="100px" marginBottom="2rem" /> */}
          <Box
            width="100%"
            maxWidth="400px"
            bg="white"
            padding="2rem"
            borderRadius="md"
            boxShadow="md"
          >
            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                <FormControl id="username" isInvalid={!!formErrors.username}>
                  <FormLabel>Username</FormLabel>
                  <Input
                    type="text"
                    id="username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                  {formErrors.username && (
                    <Text color="red.500" fontSize="sm">
                      {formErrors.username}
                    </Text>
                  )}
                </FormControl>
                <FormControl id="password" isInvalid={!!formErrors.password}>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  {formErrors.password && (
                    <Text color="red.500" fontSize="sm">
                      {formErrors.password}
                    </Text>
                  )}
                </FormControl>
                <Button
                  type="submit"
                  colorScheme="blue"
                  width="full"
                  isLoading={isSubmitting}
                  loadingText="Submitting"
                >
                  Login
                </Button>
              </Stack>
            </form>
            <Text mt={4} textAlign="center"> <Link to="/user/signup">Sign Up</Link></Text>
          </Box>
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default Login;
