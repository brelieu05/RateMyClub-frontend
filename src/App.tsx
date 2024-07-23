import { useState, useEffect, ChangeEvent } from 'react'
import axios from 'axios';
import { Stack, Grid, Flex, Center, HStack, VStack, Input, Textarea, Button, FormControl, Text, Spacer } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Navbar from './assets/Navbar';
import AuthContextProvider from './contexts/authContext/authContext';
function App() {

  // const [formData, setFormData] = useState({
  //   description: "",
  //   username: "", 
  //   review_date: (new Date()).toISOString().split('T')[0],
  //   club_name: "",
  //   rating: 0
  // }); 

  // const [allReviews, setAllReviews] = useState({});

  // useEffect(() => {
  //   const fetchReviews = async () => {
  //     const response = await axios.get('http://localhost:5000/clubs');
      
  //     setAllReviews(response.data);
  //   }
  //   fetchReviews();
  // }, [])

  // useEffect(() => {
  //   console.log("allReviews", allReviews)    
  // }, [allReviews])

  // const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
    
  //   setFormData({
  //     ...formData,
  //     [name]: name === 'rating' ? Number(value) : value
  //   });
  // };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   // e.preventDefault();
  //   const response = await axios.post('http://localhost:5000/reviews', formData);
  //   console.log(response);
  // };

  return (
    // <VStack>

    //   <FormControl onSubmit={handleSubmit}>
    //     <VStack>
    //       <HStack>
    //           <Input placeholder='username' name='username' value={formData.username} onChange={handleChange}/>
    //           <Input placeholder='club name' name='club_name' value={formData.club_name} onChange={handleChange}/>
    //           <Input placeholder='rating' name='rating' value={formData.rating} onChange={handleChange} type="number" min={0} max={5}/>
    //       </HStack>
    //         <Textarea placeholder='description' name='description' value={formData.description} onChange={handleChange} size='lg' maxW='520px' h='sm'/>
    //         <Button type="submit">Submit</Button> 
    //     </VStack>
    //   </FormControl>

    //   <VStack>
    //     {/* Give it a proper JSON type */}
    //       {Object.values(allReviews).map((item : any) => (
    //         <Stack>
    //           <HStack>
    //               <Text>{item.username}</Text>
    //               <Text>{item.club_name}</Text>
    //               <Text>{item.review_date.substring(0,10)}</Text>
    //               <Text>{item.rating}</Text>
    //           </HStack>
    //             <Text>{item.description}</Text>
    //         </Stack>
    //       ))}
    //   </VStack>

    // </VStack>
    <AuthContextProvider>
      <Navbar />
      <Outlet/>
    </AuthContextProvider>
  );
}

export default App
