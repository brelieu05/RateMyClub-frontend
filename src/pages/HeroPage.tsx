import React, { useState } from 'react'
import Search from '../assets/Search'
import { Center, HStack, VStack, Text } from '@chakra-ui/react'
import { Autocomplete, Option } from 'chakra-ui-simple-autocomplete';
import { CUIAutoComplete } from 'chakra-ui-autocomplete'

const countries = [
  { value: "ghana", label: "Ghana" },
  { value: "nigeria", label: "Nigeria" },
  { value: "kenya", label: "Kenya" },
  { value: "southAfrica", label: "South Africa" },
  { value: "unitedStates", label: "United States" },
  { value: "canada", label: "Canada" },
  { value: "germany", label: "Germany" }
];


export default function HeroPage() {
  const [result, setResult] = useState([]);

  const [pickerItems, setPickerItems] = React.useState(countries);
  const [selectedItems, setSelectedItems] = React.useState<Item[]>([]);

  const handleCreateItem = (item: Item) => {
    setPickerItems((curr) => [...curr, item]);
    setSelectedItems((curr) => [...curr, item]);
  };

  const handleSelectedItemsChange = (selectedItems?: Item[]) => {
    if (selectedItems) {
      setSelectedItems(selectedItems);
    }
  };
  
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
