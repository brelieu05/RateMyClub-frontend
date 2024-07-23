import React from 'react'
import Search from '../assets/Search'
import { Box, Center, Container, Heading, HStack, Spacer, VStack, Text } from '@chakra-ui/react'

export default function HeroPage() {
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
            </VStack>
        </Center>
    </>
  )
}
