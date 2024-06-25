import React from 'react';
import { VStack, FormControl, FormLabel, Input, Button, Text } from '@chakra-ui/react';

const DeleteAccountForm = ({ onClose }) => {
  return (
    <VStack spacing={4}>
      <Text color="red.500" fontWeight="bold">Warning: This action cannot be undone.</Text>
      <FormControl>
        <FormLabel>Username</FormLabel>
        <Input placeholder="Enter your username" />
      </FormControl>
      <FormControl>
        <FormLabel>Password</FormLabel>
        <Input type="password" placeholder="Enter your password" />
      </FormControl>
      <Button colorScheme="red" onClick={onClose}>Delete Account</Button>
    </VStack>
  );
};

export default DeleteAccountForm;