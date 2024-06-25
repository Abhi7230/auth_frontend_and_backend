import React from 'react';
import { VStack, FormControl, FormLabel, Input, Button } from '@chakra-ui/react';

const ChangePasswordForm = ({ onClose }) => {
  return (
    <VStack spacing={4}>
      <FormControl>
        <FormLabel>Current Password</FormLabel>
        <Input type="password" placeholder="Enter current password" />
      </FormControl>
      <FormControl>
        <FormLabel>New Password</FormLabel>
        <Input type="password" placeholder="Enter new password" />
      </FormControl>
      <FormControl>
        <FormLabel>Confirm New Password</FormLabel>
        <Input type="password" placeholder="Confirm new password" />
      </FormControl>
      <Button colorScheme="green" onClick={onClose}>Change Password</Button>
    </VStack>
  );
};

export default ChangePasswordForm;