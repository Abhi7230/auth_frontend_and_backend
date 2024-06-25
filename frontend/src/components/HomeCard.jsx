// src/components/HomeCard.js
import React from 'react';
import { Box, Image, Text, LinkBox, LinkOverlay } from '@chakra-ui/react';

const HomeCard = ({ title, image, link }) => {
  return (
    <LinkBox as="article" maxW="sm" p="5" borderWidth="1px" rounded="md" _hover={{ shadow: 'md' }}>
      <Image borderRadius="md" src={image} alt={title} />
      <LinkOverlay href={link}>
        <Text mt="2" fontSize="xl" fontWeight="semibold" lineHeight="short">
          {title}
        </Text>
      </LinkOverlay>
    </LinkBox>
  );
};

export default HomeCard;