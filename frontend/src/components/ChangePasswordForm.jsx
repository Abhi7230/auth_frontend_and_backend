import React, { useState } from 'react';
import { VStack, FormControl, FormLabel, Input, Button, useToast } from '@chakra-ui/react';
import Cookies from 'js-cookie';

const ChangePasswordForm = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [formErrors, setFormErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const validateFormData = () => {
    const errors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };

    if (!formData.currentPassword.trim()) {
      errors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword.trim()) {
      errors.newPassword = 'New password is required';
    }

    if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
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
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });

    const isFormValid = validateFormData();

    if (isFormValid) {
      try {
        const authToken = Cookies.get('authToken');
        const response = await fetch('http://localhost:2999/changepassword', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify({
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword
          }),
        });

        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(errorMessage || 'Password change failed');
        }

        toast({
          title: 'Password Changed Successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

      } catch (error) {
        console.error('Error during password change:', error.message);
        toast({
          title: 'Password Change Failed',
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
        <FormControl isInvalid={!!formErrors.currentPassword}>
          <FormLabel>Current Password</FormLabel>
          <Input
            type="password"
            name="currentPassword"
            placeholder="Enter current password"
            value={formData.currentPassword}
            onChange={handleChange}
          />
          {formErrors.currentPassword && (
            <Text color="red.500" fontSize="sm">
              {formErrors.currentPassword}
            </Text>
          )}
        </FormControl>
        <FormControl isInvalid={!!formErrors.newPassword}>
          <FormLabel>New Password</FormLabel>
          <Input
            type="password"
            name="newPassword"
            placeholder="Enter new password"
            value={formData.newPassword}
            onChange={handleChange}
          />
          {formErrors.newPassword && (
            <Text color="red.500" fontSize="sm">
              {formErrors.newPassword}
            </Text>
          )}
        </FormControl>
        <FormControl isInvalid={!!formErrors.confirmPassword}>
          <FormLabel>Confirm New Password</FormLabel>
          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirm new password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {formErrors.confirmPassword && (
            <Text color="red.500" fontSize="sm">
              {formErrors.confirmPassword}
            </Text>
          )}
        </FormControl>
        <Button
          colorScheme="green"
          type="submit"
          isLoading={isSubmitting}
        >
          Change Password
        </Button>
      </VStack>
    </form>
  );
};

export default ChangePasswordForm;
