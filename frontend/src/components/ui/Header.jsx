import React, { useState, useRef, useCallback } from 'react';
import {
  Box,
  Flex,
  Image,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  HStack,
  VStack,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  List,
  ListItem,
  useColorModeValue,
} from '@chakra-ui/react';
import { SearchIcon, HamburgerIcon, ChevronDownIcon } from '@chakra-ui/icons';
import algologo from '../../assets/algosprint_logo.jpeg'

// Mock data for search
const searchData = [
  "Arrays and Strings",
  "Linked Lists",
  "Trees and Graphs",
  "Sorting and Searching",
  "Dynamic Programming",
  "Backtracking",
  "Greedy Algorithms",
  "Bit Manipulation",
  "Math and Logic Puzzles",
  "Object-Oriented Design",
];

// You'll need to create this icon or import it from a library
const CoinIcon = (props) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="12" cy="12" r="10" fill="currentColor" />
    <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="14px" fontWeight="bold">
      $
    </text>
  </svg>
);

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef(null);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const NavItems = () => (
    <>
      <Button variant="ghost" _hover={{ bg: 'blue.50' }}>Dashboard</Button>
      <Button variant="ghost" _hover={{ bg: 'blue.50' }}>Refer a Friend</Button>
      <Button variant="ghost" _hover={{ bg: 'blue.50' }}>Assignments</Button>
      <Button variant="ghost" _hover={{ bg: 'blue.50' }}>Contests</Button>
    </>
  );

  const debouncedSearch = useCallback(
    debounce((searchTerm) => {
      if (searchTerm.length > 0) {
        const filteredResults = searchData.filter(item =>
          item.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(filteredResults);
        setIsSearching(true);
      } else {
        setIsSearching(false);
      }
    }, 300),
    []
  );

  const handleSearch = (event) => {
    const searchTerm = event.target.value;
    debouncedSearch(searchTerm);
  };

  return (
    <Box as="header" bg={bgColor} boxShadow="sm" position="sticky" top={0} zIndex={1000}>
      <Flex
        align="center"
        justify="space-between"
        wrap="wrap"
        padding="1rem"
        maxWidth="1200px"
        margin="0 auto"
        color="white"
        bgGradient="linear(to-r, #7928CA, #FF0080)"
      >
        <Flex align="center" mr={5}>
          <Image
            borderRadius="full"
            boxSize="40px"
            src={algologo}
            alt="AlgoSprint Logo"
            mr={3}
          />
          <Text fontSize="xl" fontWeight="bold">
            AlgoSprint
          </Text>
        </Flex>

        <Box flex={1} maxWidth="400px" mx={4}>
          <Popover
            isOpen={isSearching}
            onClose={() => setIsSearching(false)}
            placement="bottom"
            matchWidth
          >
            <PopoverTrigger>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.300" />
                </InputLeftElement>
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search topics..."
                  onChange={handleSearch}
                  borderColor={borderColor}
                  _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px #3182ce' }}
                />
              </InputGroup>
            </PopoverTrigger>
            <PopoverContent borderColor={borderColor}>
              <PopoverBody padding={0}>
                <List spacing={0}>
                  {searchResults.map((result, index) => (
                    <ListItem
                      key={index}
                      padding={3}
                      _hover={{ bg: "blue.50" }}
                      cursor="pointer"
                    >
                      {result}
                    </ListItem>
                  ))}
                </List>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </Box>

        <HStack spacing={4} display={{ base: 'none', md: 'flex' }}>
          <NavItems />
          <Flex align="center" bg="yellow.100" px={3} py={2} borderRadius="md">
            <CoinIcon color="yellow.500" mr={2} />
            <Text fontWeight="bold">1000 ASCoins</Text>
          </Flex>
          <Button colorScheme="red">
            Logout
          </Button>
        </HStack>

        <IconButton
          display={{ base: 'flex', md: 'none' }}
          onClick={onOpen}
          icon={<HamburgerIcon />}
          variant="outline"
          aria-label="Open menu"
          color="white"
        />
      </Flex>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Menu</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="stretch">
              <NavItems />
              <Flex align="center" bg="yellow.100" px={3} py={2} borderRadius="md">
                <CoinIcon color="yellow.500" mr={2} />
                <Text fontWeight="bold">1000 ASCoins</Text>
              </Flex>
              <Button colorScheme="red">
                Logout
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Header;
