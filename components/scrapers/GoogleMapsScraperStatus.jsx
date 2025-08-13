import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Badge,
  Spinner,
  Select,
  HStack,
  useToast,
  Icon,
  Tooltip,
} from '@chakra-ui/react';
import { FaDownload, FaPlay, FaStop, FaCheck, FaTimes, FaInfoCircle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

const GoogleMapsScraperStatus = () => {
  const [status, setStatus] = useState('loading');
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({
    totalLeads: 0,
    qualifiedLeads: 0,
    lastUpdate: null,
    isRunning: false,
    runningTime: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const toast = useToast();
  const { user } = useAuth();

  const locations = [
    'New York, NY',
    'Los Angeles, CA',
    'Chicago, IL',
    'Houston, TX',
    'Phoenix, AZ',
    'Philadelphia, PA',
    'San Antonio, TX',
    'San Diego, CA',
    'Dallas, TX',
    'Austin, TX'
  ];

  const categories = [
    'restaurants',
    'plumbers',
    'electricians',
    'auto repair',
    'dentists',
    'hair salons',
    'lawyers',
    'accountants',
    'gyms',
    'retail stores'
  ];

  useEffect(() => {
    fetchStatus();
    fetchLeads();
    
    const interval = setInterval(() => {
      fetchStatus();
    }, 30000); // Update status every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const fetchStatus = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/scrapers/google-maps/status');
      setStats({
        totalLeads: response.data.totalLeads,
        qualifiedLeads: response.data.qualifiedLeads,
        lastUpdate: response.data.lastUpdate,
        isRunning: response.data.isRunning,
        runningTime: response.data.runningTime
      });
      setStatus(response.data.isRunning ? 'running' : 'stopped');
    } catch (error) {
      console.error('Error fetching scraper status:', error);
      toast({
        title: 'Error fetching status',
        description: 'Could not retrieve scraper status',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLeads = async () => {
    try {
      const response = await api.get('/api/scrapers/google-maps/leads', {
        params: { limit: 5 }
      });
      setLeads(response.data.leads);
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  const startScraper = async () => {
    try {
      setStatus('starting');
      await api.post('/api/scrapers/google-maps/start', {
        location: selectedLocation || undefined,
        businessType: selectedCategory || undefined,
        userId: user.id
      });
      toast({
        title: 'Scraper Started',
        description: 'Google Maps scraper has been started successfully',
        status: 'success',
        duration: 5000,
        isClosable: true
      });
      setStatus('running');
      fetchStatus();
    } catch (error) {
      console.error('Error starting scraper:', error);
      toast({
        title: 'Error',
        description: 'Failed to start Google Maps scraper',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
      setStatus('stopped');
    }
  };

  const stopScraper = async () => {
    try {
      setStatus('stopping');
      await api.post('/api/scrapers/google-maps/stop');
      toast({
        title: 'Scraper Stopped',
        description: 'Google Maps scraper has been stopped successfully',
        status: 'info',
        duration: 5000,
        isClosable: true
      });
      setStatus('stopped');
      fetchStatus();
    } catch (error) {
      console.error('Error stopping scraper:', error);
      toast({
        title: 'Error',
        description: 'Failed to stop Google Maps scraper',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  const exportLeads = async () => {
    try {
      const response = await api.get('/api/scrapers/google-maps/export', {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `google-maps-leads-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast({
        title: 'Export Complete',
        description: 'Leads have been exported successfully',
        status: 'success',
        duration: 5000,
        isClosable: true
      });
    } catch (error) {
      console.error('Error exporting leads:', error);
      toast({
        title: 'Export Failed',
        description: 'Could not export leads',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'running':
        return <Badge colorScheme="green">Running</Badge>;
      case 'starting':
        return <Badge colorScheme="yellow">Starting</Badge>;
      case 'stopping':
        return <Badge colorScheme="orange">Stopping</Badge>;
      case 'stopped':
        return <Badge colorScheme="red">Stopped</Badge>;
      case 'loading':
        return <Badge colorScheme="blue">Loading</Badge>;
      default:
        return <Badge colorScheme="gray">Unknown</Badge>;
    }
  };

  return (
    <Card p={5} shadow="md" borderRadius="lg">
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Heading size="md">Google Maps Scraper Status</Heading>
        {getStatusBadge()}
      </Flex>

      {isLoading ? (
        <Flex justifyContent="center" alignItems="center" h="200px">
          <Spinner size="xl" />
        </Flex>
      ) : (
        <>
          <Flex mb={6}>
            <Box flex={1} p={3} borderRadius="md" bg="gray.50">
              <Text fontSize="sm" color="gray.500">Total Leads</Text>
              <Text fontSize="2xl" fontWeight="bold">{stats.totalLeads}</Text>
            </Box>
            <Box flex={1} p={3} borderRadius="md" bg="gray.50" mx={2}>
              <Text fontSize="sm" color="gray.500">Qualified Leads</Text>
              <Text fontSize="2xl" fontWeight="bold">{stats.qualifiedLeads}</Text>
            </Box>
            <Box flex={1} p={3} borderRadius="md" bg="gray.50">
              <Text fontSize="sm" color="gray.500">Last Update</Text>
              <Text fontSize="md" fontWeight="bold">
                {stats.lastUpdate ? new Date(stats.lastUpdate).toLocaleString() : 'Never'}
              </Text>
            </Box>
          </Flex>

          <Box mb={6}>
            <Text mb={2} fontWeight="medium">Scraper Controls</Text>
            <Flex alignItems="center">
              <Select
                placeholder="Select location"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                mr={2}
                size="sm"
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </Select>
              <Select
                placeholder="Select business type"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                mr={2}
                size="sm"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </Select>
              <HStack>
                <Tooltip label="Start scraper">
                  <Button
                    leftIcon={<Icon as={FaPlay} />}
                    colorScheme="green"
                    size="sm"
                    onClick={startScraper}
                    isDisabled={status === 'running' || status === 'starting'}
                  >
                    Start
                  </Button>
                </Tooltip>
                <Tooltip label="Stop scraper">
                  <Button
                    leftIcon={<Icon as={FaStop} />}
                    colorScheme="red"
                    size="sm"
                    onClick={stopScraper}
                    isDisabled={status === 'stopped' || status === 'stopping'}
                  >
                    Stop
                  </Button>
                </Tooltip>
                <Tooltip label="Export all qualified leads">
                  <Button
                    leftIcon={<Icon as={FaDownload} />}
                    colorScheme="blue"
                    size="sm"
                    onClick={exportLeads}
                  >
                    Export
                  </Button>
                </Tooltip>
              </HStack>
            </Flex>
          </Box>

          {leads.length > 0 ? (
            <Box overflowX="auto">
              <Text mb={2} fontWeight="medium">Recent Qualified Leads</Text>
              <Table size="sm" variant="simple">
                <Thead>
                  <Tr>
                    <Th>Business Name</Th>
                    <Th>Location</Th>
                    <Th>Rating</Th>
                    <Th>Reviews</Th>
                    <Th>Website</Th>
                    <Th>Qualified</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {leads.map((lead) => (
                    <Tr key={lead.id}>
                      <Td>{lead.name}</Td>
                      <Td>{lead.location}</Td>
                      <Td>{lead.rating}</Td>
                      <Td>{lead.reviews}</Td>
                      <Td>{lead.website ? 
                        <Icon as={FaCheck} color="green.500" /> : 
                        <Icon as={FaTimes} color="red.500" />}
                      </Td>
                      <Td>{lead.qualified ? 
                        <Icon as={FaCheck} color="green.500" /> : 
                        <Icon as={FaTimes} color="red.500" />}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          ) : (
            <Box p={4} textAlign="center">
              <Text color="gray.500">No leads data available</Text>
            </Box>
          )}
          
          {stats.isRunning && stats.runningTime && (
            <Flex justify="flex-end" mt={4}>
              <Text fontSize="sm" color="gray.500">
                Running for: {stats.runningTime}
              </Text>
            </Flex>
          )}
        </>
      )}
    </Card>
  );
};

export default GoogleMapsScraperStatus;
