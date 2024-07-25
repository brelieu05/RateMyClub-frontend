import React, { useState } from 'react'
import Search from '../assets/Search'
import { Center, HStack, VStack, Text } from '@chakra-ui/react'
import { Autocomplete, Option } from 'chakra-ui-simple-autocomplete';

const options = [
  { value: 'javascript', label: 'Javascript' },
  { value: 'chakra', label: 'Chakra' },
  { value: 'react', label: 'React' },
  { value: 'css', label: 'CSS' },
];



export default function HeroPage() {
  const [result, setResult] = useState([]);
  
  return (
    <>
        <Center>
            <VStack>
            <HStack mb='4'>
              <Text as='h1' fontSize='4xl' fontWeight='200'>Join The </Text>
              <Text as='h1' fontSize='4xl' fontWeight='bold'>Best Club</Text>
              <Text as='h1' fontSize='4xl' fontWeight='200'>For You.</Text>
            </HStack>
                <Search width={'md'}/>
                {/* <Autocomplete
                  options={options}
                  result={result}
                  setResult={(options) => setResult(options)}
                  placeholder="Autocomplete"
                  size='lg'
                  border='2px'
                />*/}
            </VStack> 
        </Center>
    </>
  )
}
