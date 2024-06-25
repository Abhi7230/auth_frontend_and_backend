import React, { useState, useEffect } from 'react';
import { VStack, FormControl, FormLabel, Input, Button, useToast } from '@chakra-ui/react';
import Cookies from 'js-cookie';

const UpdateProfileForm = ({ onClose }) => {
  const [user, setUser] = useState({ username: '', firstName: '', lastName: '' });
  const [isUpdating, setIsUpdating] = useState(false);
  const toast = useToast();

  const authToken = Cookies.get('authToken'); 

  useEffect(() => {
    if (authToken) {
      getUserDetails();
    }
  }, [authToken]);

  async function getUserDetails() {
    try {
      const response = await fetch('http://localhost:2999/userdetails', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const userDetails = await response.json();
      setUser({
        username: userDetails.username,
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
      });
    } catch (error) {
      console.error('Error fetching user details:', error.message);
      toast({
        title: 'Error',
        description: `Failed to fetch user details: ${error.message}`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }

  const updateUserProfile = async () => {
    setIsUpdating(true);

    try {
      const response = await fetch('http://localhost:2999/updateprofile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || 'Updating failed');
      }

      const result = await response.json();
      Cookies.remove('authToken'); // Clear the existing cookie
      Cookies.set('authToken', result.token, { expires: 0.24 }); // Update the cookie with the new token

      toast({
        title: 'Profile Updated Successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

    } catch (error) {
      console.error('Error during profile update:', error.message);
      toast({
        title: 'Update Failed',
        description: error.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  return (
    <VStack spacing={4}>
      <FormControl>
        <FormLabel>Username</FormLabel>
        <Input
          name="username"
          placeholder="Enter your username"
          value={user.username}
          onChange={handleChange}
        />
      </FormControl>
      <FormControl>
        <FormLabel>First Name</FormLabel>
        <Input
          name="firstName"
          placeholder="Enter your first name"
          value={user.firstName}
          onChange={handleChange}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Last Name</FormLabel>
        <Input
          name="lastName"
          placeholder="Enter your last name"
          value={user.lastName}
          onChange={handleChange}
        />
      </FormControl>
      <Button
        colorScheme="blue"
        onClick={updateUserProfile}
        isLoading={isUpdating}
      >
        Update Profile
      </Button>
    </VStack>
  );
};

export default UpdateProfileForm;
