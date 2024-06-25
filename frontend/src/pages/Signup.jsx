import React, { useState, useEffect } from 'react';
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
  SimpleGrid,
  HStack,
  useToast,
} from '@chakra-ui/react';
import { EmailIcon, LockIcon, InfoIcon } from '@chakra-ui/icons';
import signupimage from '../assets/algosprint_login.jpg';
import wavy from '../assets/algosprint_back.jpg';
import algo_logo from '../assets/algosprint_logo.jpeg'
import { Link,useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Signup = () => {
  const {referral_id} = useParams()
  const toast = useToast();
  const navigate = useNavigate();

  const [referralid, setReferralid] = useState('');

  useEffect(()=>{
    if(referral_id){
      setReferralid(referral_id)
    }
  },[referral_id])

  

  

  useEffect(()=>{
    console.log(referral_id)
  },[referral_id])

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    firstName: '',
    lastName: '',
  });

  const [formErrors, setFormErrors] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    firstName: '',
    lastName: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Regular expressions for validation
  const emailRegex = /^[a-zA-Z0-9+_-]+@[a-zA-Z0-9-]+\.[a-z]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  const validateFormData = async () => {
    const errors = {
      username: '',
      password: '',
      confirmPassword: '',
      email: '',
      firstName: '',
      lastName: '',
    };

    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    } else if (await checkUsernameExists(formData.username)) {
      errors.username = 'Username is already taken';
    }

    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Invalid email format';
    } else if (await checkEmailExists(formData.email)) {
      errors.email = 'Email is already taken';
    }

    if (!formData.password.trim()) {
      errors.password = 'Password is required';
    } else if (!passwordRegex.test(formData.password)) {
      errors.password =
        'Password must be at least 8 characters long and contain at least one letter and one number';
    }

    if (formData.confirmPassword !== formData.password) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFormErrors(errors);

    // Return true if there are no errors
    return Object.values(errors).every((error) => !error);
  };

  const checkUsernameExists = async (username) => {
    // Simulate an API call to check if the username exists
    const response = await fetch(`http://localhost:2999/check-username`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    });

    const result = await response.json();
    return result.exists;
  };

  const checkEmailExists = async (email) => {
    // Simulate an API call to check if the email exists
    const response = await fetch(`http://localhost:2999/check-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const result = await response.json();
    return result.exists;
  };

  const registerUser = async () => {
    try {
      const response = await fetch(`http://localhost:2999/register/${referralid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
        }),
      });

      // Check if response is not successful (status outside 200-299)
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || 'Registration failed');
      }

      toast({
        title: 'Registration Successful',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      const result = await response.json();
      Cookies.set('authToken', result.token, { expires: 0.24 });

      navigate('/home');
    } catch (error) {
      console.error('Error during registration:', error.message);
      toast({
        title: 'Registration Failed',
        description: error.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false); // Reset isSubmitting state after submission attempt
    }
  };

  const handleChange = async (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));

    // Live validation
    const errors = { ...formErrors };

    switch (id) {
      case 'username':
        if (!value.trim()) {
          errors.username = 'Username is required';
        } else if (await checkUsernameExists(value)) {
          errors.username = 'Username is already taken';
        } else {
          errors.username = '';
        }
        break;
      case 'email':
        if (!value.trim()) {
          errors.email = 'Email is required';
        } else if (!emailRegex.test(value)) {
          errors.email = 'Invalid email format';
        } else if (await checkEmailExists(value)) {
          errors.email = 'Email is already taken';
        } else {
          errors.email = '';
        }
        break;
      case 'password':
        if (!value.trim()) {
          errors.password = 'Password is required';
        } else if (!passwordRegex.test(value)) {
          errors.password =
            'Password must be at least 8 characters long and contain at least one letter and one number';
        } else {
          errors.password = '';
        }

        if (formData.confirmPassword !== value) {
          errors.confirmPassword = 'Passwords do not match';
        } else {
          errors.confirmPassword = '';
        }
        break;
      case 'confirmPassword':
        if (formData.password !== value) {
          errors.confirmPassword = 'Passwords do not match';
        } else {
          errors.confirmPassword = '';
        }
        break;
      default:
        if (!value.trim()) {
          errors[id] = `${id.charAt(0).toUpperCase() + id.slice(1)} is required`;
        } else {
          errors[id] = '';
        }
        break;
    }

    setFormErrors(errors);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsSubmitting(true); // Set isSubmitting to true on form submission

    // Clear previous form errors
    setFormErrors({
      username: '',
      password: '',
      confirmPassword: '',
      email: '',
      firstName: '',
      lastName: '',
    });

    // Validate form data
    const isFormValid = await validateFormData();

    // Register user if form is valid
    if (isFormValid) {
      await registerUser();

      // Clear form data after registration
      setFormData({
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        firstName: '',
        lastName: '',
      });

      setIsSubmitting(false); // Reset isSubmitting state after successful submission
    } else {
      setIsSubmitting(false); // Reset isSubmitting state after failed submission
    }
  };

  return (
    <ChakraProvider>
      <Box display="flex" height="100vh" flexDirection={{ base: 'column', md: 'row' }}>
        {/* Left side with image and overlay (45%) */}
        <Box flex="0.82" position="relative">
        <Image src={signupimage} alt="login Image" objectFit="cover" width="100%" height={{ base: '50vh', md: '100vh' }} />
        <Box position="absolute" top="0" left="0" width="100%" height="100%" bg="rgba(0, 0, 0, 0.5)" color="white" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
          {/* <Text fontSize="3xl" fontWeight="bold">Welcome to AlgoSprint</Text> */}
          {/* <Text fontSize="lg" mt={2} textAlign="center">Join us to improve your algorithms and coding skills.</Text> */}
          <Box mt={4} display="flex" flexDirection="column" alignItems="center">
            <Box display="flex" alignItems="center" mt={2}>
              {/* <Icon as={InfoIcon} w={6} h={6} mr={2} /> */}
              {/* <Text>Learn from the best</Text> */}
            </Box>
            <Box display="flex" alignItems="center" mt={2}>
              {/* <Icon as={EmailIcon} w={6} h={6} mr={2} /> */}
              {/* <Text>Get personalized feedback</Text> */}
            </Box>
            <Box display="flex" alignItems="center" mt={2}>
              {/* <Icon as={LockIcon} w={6} h={6} mr={2} /> */}
              {/* <Text>Secure and private</Text> */}
            </Box>
          </Box>
        </Box>
      </Box>
        {/* Right side with form (55%) */}
        <Box
          flex="1"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          py={10}
          backgroundImage={`url(${wavy})`}
          backgroundSize="cover"
          backgroundPosition="center"
        >
          <Flex
            width="85%"
            flexDirection="column"
            alignItems="center"
            mb={6}
            p={4}
            borderRadius="md"
            bg="rgba(255, 255, 255, 0.8)"
            backdropFilter="blur(10px)"
          >
            {/* <Flex alignItems="center">
              <Image src={algo_logo} alt="Logo" boxSize="50px" borderRadius="full" />
              <Heading size="md" ml={3}>
                AlgoSprint
              </Heading>
            </Flex> */}
          </Flex>
          <Box
            width="85%"
            bg="rgba(255, 255, 255, 0.9)"
            p={8}
            borderRadius="lg"
            boxShadow="xl"
            backdropFilter="blur(10px)"
          >
            <form onSubmit={handleSubmit}>
              <SimpleGrid columns={2} spacing={6}>
                <FormControl id="username" isInvalid={!!formErrors.username}>
                  <FormLabel>Username</FormLabel>
                  <Input
                    type="text"
                    id="username"
                    value={formData.username}
                    onChange={handleChange}
                    bg="white"
                    borderColor="gray.300"
                    _hover={{ borderColor: 'gray.400' }}
                  />
                  {formErrors.username && (
                    <Text color="red.500" fontSize="sm">
                      {formErrors.username}
                    </Text>
                  )}
                </FormControl>
                <FormControl id="firstName" isInvalid={!!formErrors.firstName}>
                  <FormLabel>First Name</FormLabel>
                  <Input
                    type="text"
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    bg="white"
                    borderColor="gray.300"
                    _hover={{ borderColor: 'gray.400' }}
                  />
                  {formErrors.firstName && (
                    <Text color="red.500" fontSize="sm">
                      {formErrors.firstName}
                    </Text>
                  )}
                </FormControl>
                <FormControl id="lastName" isInvalid={!!formErrors.lastName}>
                  <FormLabel>Last Name</FormLabel>
                  <Input
                    type="text"
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    bg="white"
                    borderColor="gray.300"
                    _hover={{ borderColor: 'gray.400' }}
                  />
                  {formErrors.lastName && (
                    <Text color="red.500" fontSize="sm">
                      {formErrors.lastName}
                    </Text>
                  )}
                </FormControl>
                <FormControl id="email" isInvalid={!!formErrors.email}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    bg="white"
                    borderColor="gray.300"
                    _hover={{ borderColor: 'gray.400' }}
                  />
                  {formErrors.email && (
                    <Text color="red.500" fontSize="sm">
                      {formErrors.email}
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
                    bg="white"
                    borderColor="gray.300"
                    _hover={{ borderColor: 'gray.400' }}
                  />
                  {formErrors.password && (
                    <Text color="red.500" fontSize="sm">
                      {formErrors.password}
                    </Text>
                  )}
                </FormControl>
                <FormControl
                  id="confirmPassword"
                  isInvalid={!!formErrors.confirmPassword}
                >
                  <FormLabel>Confirm Password</FormLabel>
                  <Input
                    type="password"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    bg="white"
                    borderColor="gray.300"
                    _hover={{ borderColor: 'gray.400' }}
                  />
                  {formErrors.confirmPassword && (
                    <Text color="red.500" fontSize="sm">
                      {formErrors.confirmPassword}
                    </Text>
                  )}
                </FormControl>
              </SimpleGrid>
              <Button
                type="submit"
                colorScheme="blue"
                width="50%"
                mt={8}
                mx="auto"
                display="block"
                isLoading={isSubmitting} // Show loading state while submitting
                loadingText="Submitting"
              >
                Sign Up
              </Button>
            </form>
            <HStack justifyContent="center" mt={4}>
              <Text>Already have an account?</Text>
              <Button variant="link" colorScheme="blue">
                <Link to="/user/login">Login</Link>
              </Button>
            </HStack>
          </Box>
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default Signup;
