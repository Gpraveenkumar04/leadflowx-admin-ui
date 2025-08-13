import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  Flex,
  Grid,
  Heading,
  Select,
  Stack,
  Text,
  Textarea,
  Badge,
  IconButton,
  useToast,
  VStack,
  HStack,
  Divider,
  FormControl,
  FormLabel,
  Switch,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Icon
} from '@chakra-ui/react';
import { FaCog, FaMap, FaHistory, FaFileExport, FaChartLine } from 'react-icons/fa';
import { MdSettings, MdSave } from 'react-icons/md';

import AdminLayout from '../../../components/layouts/AdminLayout';
import PageHeader from '../../../components/ui/PageHeader';
import GoogleMapsScraperStatus from '../../../components/scrapers/GoogleMapsScraperStatus';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../lib/api';

const GoogleMapsScraper = () => {
  const toast = useToast();
  const { user } = useAuth();
  const [config, setConfig] = useState({
    maxRequestsPerHour: 300,
    maxLeadsPerRun: 1000,
    locationRadius: 25, // miles
    businessTypePriority: 'restaurants,plumbers,electricians,auto repair',
    qualificationCriteria: {
      minRating: 3.5,
      minReviews: 5,
      noWebsiteOnly: true,
      includeNewBusinesses: true,
    },
    advancedSettings: {
      useProxy: false,
      proxyRotation: 'sequential',
      userAgentRotation: true,
      crawlDelay: 2, // seconds
      dataRetentionDays: 90,
    }
  });

  const handleConfigChange = (field, value) => {
    setConfig((prevConfig) => ({
      ...prevConfig,
      [field]: value
    }));
  };

  const handleNestedConfigChange = (parentField, field, value) => {
    setConfig((prevConfig) => ({
      ...prevConfig,
      [parentField]: {
        ...prevConfig[parentField],
        [field]: value
      }
    }));
  };

  const saveConfig = async () => {
    try {
      await api.post('/api/scrapers/google-maps/config', config);
      toast({
        title: 'Configuration saved',
        description: 'Google Maps scraper configuration has been updated',
        status: 'success',
        duration: 5000,
        isClosable: true
      });
    } catch (error) {
      console.error('Error saving configuration:', error);
      toast({
        title: 'Error',
        description: 'Failed to save scraper configuration',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Google Maps Lead Scraper"
        subtitle="Configure and monitor Google Maps lead generation"
        icon={FaMap}
      />

      <Tabs variant="enclosed" mt={6}>
        <TabList>
          <Tab><Icon as={FaCog} mr={2} /> Status & Control</Tab>
          <Tab><Icon as={MdSettings} mr={2} /> Configuration</Tab>
          <Tab><Icon as={FaChartLine} mr={2} /> Analytics</Tab>
          <Tab><Icon as={FaHistory} mr={2} /> History</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Box py={4}>
              <GoogleMapsScraperStatus />
            </Box>
          </TabPanel>

          <TabPanel>
            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6} py={4}>
              <Card p={5} shadow="md" borderRadius="lg">
                <Heading size="md" mb={4}>Basic Configuration</Heading>
                <VStack spacing={4} align="stretch">
                  <FormControl>
                    <FormLabel>Rate Limiting (requests/hour)</FormLabel>
                    <NumberInput
                      min={1}
                      max={1000}
                      value={config.maxRequestsPerHour}
                      onChange={(valueString) => handleConfigChange('maxRequestsPerHour', parseInt(valueString))}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Maximum Leads per Run</FormLabel>
                    <NumberInput
                      min={10}
                      max={10000}
                      value={config.maxLeadsPerRun}
                      onChange={(valueString) => handleConfigChange('maxLeadsPerRun', parseInt(valueString))}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Location Radius (miles)</FormLabel>
                    <NumberInput
                      min={1}
                      max={100}
                      value={config.locationRadius}
                      onChange={(valueString) => handleConfigChange('locationRadius', parseInt(valueString))}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Business Types Priority (comma separated)</FormLabel>
                    <Textarea
                      value={config.businessTypePriority}
                      onChange={(e) => handleConfigChange('businessTypePriority', e.target.value)}
                      placeholder="restaurants,plumbers,electricians,etc"
                      rows={3}
                    />
                  </FormControl>
                </VStack>
              </Card>

              <Card p={5} shadow="md" borderRadius="lg">
                <Heading size="md" mb={4}>Lead Qualification Criteria</Heading>
                <VStack spacing={4} align="stretch">
                  <FormControl>
                    <FormLabel>Minimum Rating</FormLabel>
                    <NumberInput
                      min={1}
                      max={5}
                      step={0.1}
                      value={config.qualificationCriteria.minRating}
                      onChange={(valueString) => handleNestedConfigChange('qualificationCriteria', 'minRating', parseFloat(valueString))}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Minimum Reviews</FormLabel>
                    <NumberInput
                      min={0}
                      max={100}
                      value={config.qualificationCriteria.minReviews}
                      onChange={(valueString) => handleNestedConfigChange('qualificationCriteria', 'minReviews', parseInt(valueString))}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                  
                  <FormControl display="flex" alignItems="center">
                    <FormLabel mb={0}>Only businesses without website</FormLabel>
                    <Switch 
                      isChecked={config.qualificationCriteria.noWebsiteOnly}
                      onChange={(e) => handleNestedConfigChange('qualificationCriteria', 'noWebsiteOnly', e.target.checked)}
                    />
                  </FormControl>
                  
                  <FormControl display="flex" alignItems="center">
                    <FormLabel mb={0}>Include new businesses</FormLabel>
                    <Switch 
                      isChecked={config.qualificationCriteria.includeNewBusinesses}
                      onChange={(e) => handleNestedConfigChange('qualificationCriteria', 'includeNewBusinesses', e.target.checked)}
                    />
                  </FormControl>
                </VStack>
              </Card>

              <Card p={5} shadow="md" borderRadius="lg" gridColumn={{ md: "span 2" }}>
                <Heading size="md" mb={4}>Advanced Settings</Heading>
                <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
                  <Box>
                    <FormControl display="flex" alignItems="center" mb={4}>
                      <FormLabel mb={0}>Use Proxy</FormLabel>
                      <Switch 
                        isChecked={config.advancedSettings.useProxy}
                        onChange={(e) => handleNestedConfigChange('advancedSettings', 'useProxy', e.target.checked)}
                      />
                    </FormControl>
                    
                    <FormControl mb={4}>
                      <FormLabel>Proxy Rotation</FormLabel>
                      <Select
                        value={config.advancedSettings.proxyRotation}
                        onChange={(e) => handleNestedConfigChange('advancedSettings', 'proxyRotation', e.target.value)}
                        isDisabled={!config.advancedSettings.useProxy}
                      >
                        <option value="sequential">Sequential</option>
                        <option value="random">Random</option>
                        <option value="weighted">Weighted</option>
                      </Select>
                    </FormControl>
                  </Box>
                  
                  <Box>
                    <FormControl display="flex" alignItems="center" mb={4}>
                      <FormLabel mb={0}>Rotate User Agents</FormLabel>
                      <Switch 
                        isChecked={config.advancedSettings.userAgentRotation}
                        onChange={(e) => handleNestedConfigChange('advancedSettings', 'userAgentRotation', e.target.checked)}
                      />
                    </FormControl>
                    
                    <FormControl mb={4}>
                      <FormLabel>Crawl Delay (seconds)</FormLabel>
                      <NumberInput
                        min={0.5}
                        max={10}
                        step={0.5}
                        value={config.advancedSettings.crawlDelay}
                        onChange={(valueString) => handleNestedConfigChange('advancedSettings', 'crawlDelay', parseFloat(valueString))}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                  </Box>
                  
                  <FormControl gridColumn={{ md: "span 2" }}>
                    <FormLabel>Data Retention (days)</FormLabel>
                    <NumberInput
                      min={1}
                      max={365}
                      value={config.advancedSettings.dataRetentionDays}
                      onChange={(valueString) => handleNestedConfigChange('advancedSettings', 'dataRetentionDays', parseInt(valueString))}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                </Grid>
              </Card>
              
              <Box gridColumn={{ md: "span 2" }}>
                <Flex justify="flex-end">
                  <Button
                    leftIcon={<Icon as={MdSave} />}
                    colorScheme="blue"
                    onClick={saveConfig}
                  >
                    Save Configuration
                  </Button>
                </Flex>
              </Box>
            </Grid>
          </TabPanel>

          <TabPanel>
            <Box py={4}>
              <Text fontSize="lg" fontWeight="medium" mb={4}>
                Analytics dashboard coming soon...
              </Text>
              <Text color="gray.500">
                This section will provide detailed analytics about the Google Maps lead generation process,
                including lead quality metrics, conversion rates, and performance over time.
              </Text>
            </Box>
          </TabPanel>

          <TabPanel>
            <Box py={4}>
              <Text fontSize="lg" fontWeight="medium" mb={4}>
                Scraper history log coming soon...
              </Text>
              <Text color="gray.500">
                This section will display the historical runs of the Google Maps scraper,
                including start/end times, lead counts, and any errors encountered.
              </Text>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </AdminLayout>
  );
};

export default GoogleMapsScraper;
