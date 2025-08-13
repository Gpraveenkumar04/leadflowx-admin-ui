import React from 'react';
import { Box, Grid, Heading, Text, SimpleGrid, Button, Icon, useColorModeValue } from '@chakra-ui/react';
import { FaYelp, FaGoogle, FaPlus } from 'react-icons/fa';
import { useRouter } from 'next/router';

import AdminLayout from '../../../components/layouts/AdminLayout';
import PageHeader from '../../../components/ui/PageHeader';

const ScraperCard = ({ title, description, icon, path, isNew = false }) => {
  const router = useRouter();
  const cardBg = useColorModeValue('white', 'gray.700');
  const cardBorderColor = useColorModeValue('gray.200', 'gray.600');
  const newBadgeBg = useColorModeValue('blue.50', 'blue.900');
  const newBadgeColor = useColorModeValue('blue.600', 'blue.200');

  return (
    <Box
      p={5}
      shadow="md"
      borderWidth="1px"
      borderColor={cardBorderColor}
      borderRadius="lg"
      bg={cardBg}
      _hover={{ 
        shadow: 'lg',
        transform: 'translateY(-2px)',
        transition: 'all 0.2s ease-in-out'
      }}
      position="relative"
      overflow="hidden"
      cursor="pointer"
      onClick={() => router.push(path)}
    >
      {isNew && (
        <Box 
          position="absolute" 
          top="0" 
          right="0" 
          py={1} 
          px={2} 
          bg={newBadgeBg} 
          color={newBadgeColor}
          fontSize="xs" 
          fontWeight="bold"
        >
          NEW
        </Box>
      )}
      <Icon as={icon} boxSize="8" mb={4} color={icon === FaGoogle ? "blue.500" : "red.500"} />
      <Heading size="md" mb={2}>{title}</Heading>
      <Text>{description}</Text>
    </Box>
  );
};

const ScrapersIndex = () => {
  const router = useRouter();
  
  const scrapers = [
    {
      title: 'Google Maps Scraper',
      description: 'Find businesses without websites on Google Maps',
      icon: FaGoogle,
      path: '/lead-generation/scrapers/google-maps',
      isNew: true
    },
    {
      title: 'Yelp Scraper',
      description: 'Extract business information from Yelp',
      icon: FaYelp,
      path: '/lead-generation/scrapers/yelp'
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        title="Lead Generation Scrapers"
        subtitle="Configure and manage lead generation scrapers"
      />
      
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mt={8}>
        {scrapers.map((scraper, index) => (
          <ScraperCard
            key={index}
            title={scraper.title}
            description={scraper.description}
            icon={scraper.icon}
            path={scraper.path}
            isNew={scraper.isNew}
          />
        ))}
        
        {/* Add New Scraper Card */}
        <Box
          p={5}
          shadow="md"
          borderWidth="1px"
          borderStyle="dashed"
          borderRadius="lg"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          opacity={0.7}
          _hover={{ opacity: 1, cursor: "pointer" }}
          onClick={() => router.push('/lead-generation/scrapers/new')}
        >
          <Icon as={FaPlus} boxSize="8" mb={4} />
          <Heading size="md" mb={2}>Add New Scraper</Heading>
          <Text textAlign="center">Configure a new lead generation source</Text>
        </Box>
      </SimpleGrid>
    </AdminLayout>
  );
};

export default ScrapersIndex;
