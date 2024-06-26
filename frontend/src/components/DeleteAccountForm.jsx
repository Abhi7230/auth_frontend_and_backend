import React, { useState } from 'react';
import { VStack, FormControl, FormLabel, Input, Button, Text, useToast } from '@chakra-ui/react';
import Cookies from 'js-cookie';

const DeleteAccountForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [formErrors, setFormErrors] = useState({
    username: '',
    password: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const validateFormData = () => {
    const errors = {
      username: '',
      password: ''
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    setFormErrors({
      username: '',
      password: ''
    });

    const isFormValid = validateFormData();

    if (isFormValid) {
      try {
        const authToken = Cookies.get('token'); // Assuming your token is stored as 'token' in cookies
        const response = await fetch('http://localhost:2999/deleteprofile', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password
          }),
        });

        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(errorMessage || 'Account deletion failed');
        }

        toast({
          title: 'Account Deleted Successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        // Perform any necessary cleanup or redirect
      } catch (error) {
        console.error('Error during account deletion:', error.message);
        toast({
          title: 'Account Deletion Failed',
          description: error.message || 'Something went wrong',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={4}>
        <Text color="red.500" fontWeight="bold">Warning: This action cannot be undone.</Text>
        <FormControl isInvalid={!!formErrors.username}>
          <FormLabel>Username</FormLabel>
          <Input
            name="username"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
          />
          {formErrors.username && (
            <Text color="red.500" fontSize="sm">
              {formErrors.username}
            </Text>
          )}
        </FormControl>
        <FormControl isInvalid={!!formErrors.password}>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            name="password"
            placeholder="Enter your password"
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
          colorScheme="red"
          type="submit"
          isLoading={isSubmitting}
        >
          Delete Account
        </Button>
      </VStack>
    </form>
  );
};

export default DeleteAccountForm;
