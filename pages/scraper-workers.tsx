import React, { useState, useEffect } from 'react';
import {
  ServerIcon,
  CodeBracketIcon,
  PlayCircleIcon,
  PauseCircleIcon,
  ArrowPathIcon,
  ExclamationCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import Layout from '../src/components/Layout';
import { useRouter } from 'next/router';

export default function ScraperWorkersPage() {
  const router = useRouter();
  const [scrapers, setScrapers] = useState([
    { id: 1, name: 'Google Maps Scraper', status: 'running', lastRun: '10 minutes ago', leadsScraped: 1254, avgRuntime: '45m' },
    { id: 2, name: 'LinkedIn Scraper', status: 'paused', lastRun: '2 hours ago', leadsScraped: 872, avgRuntime: '32m' },
    { id: 3, name: 'Facebook Scraper', status: 'error', lastRun: '1 day ago', leadsScraped: 156, avgRuntime: '15m' },
    { id: 4, name: 'Yelp Scraper', status: 'running', lastRun: '30 minutes ago', leadsScraped: 689, avgRuntime: '28m' },
    { id: 5, name: 'Yellow Pages Scraper', status: 'idle', lastRun: '5 days ago', leadsScraped: 1021, avgRuntime: '50m' },
  ]);
  
  const [isLoading, setIsLoading] = useState(false);
  
  const handleStatusChange = (scraperId, newStatus) => {
    setScrapers(scrapers.map(scraper => 
      scraper.id === scraperId ? {...scraper, status: newStatus} : scraper
    ));
  };
  
  const getStatusBadgeColor = (status) => {
    switch(status) {
      case 'running': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'idle': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusIcon = (status) => {
    switch(status) {
      case 'running': return <PlayCircleIcon className="h-5 w-5 text-green-500" />;
      case 'paused': return <PauseCircleIcon className="h-5 w-5 text-yellow-500" />;
      case 'error': return <ExclamationCircleIcon className="h-5 w-5 text-red-500" />;
      case 'idle': return <ClockIcon className="h-5 w-5 text-gray-500" />;
      default: return null;
    }
  };

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Scraper Workers</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage and monitor all scraper workers in the system.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
              onClick={() => alert('Add new scraper worker')}
            >
              Add Worker
            </button>
          </div>
        </div>
        
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        Scraper Name
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Last Run
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Leads Scraped
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Avg Runtime
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {scrapers.map((scraper) => (
                      <tr key={scraper.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          <div className="flex items-center">
                            <CodeBracketIcon className="h-5 w-5 text-gray-400 mr-2" />
                            {scraper.name}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeColor(scraper.status)}`}>
                            {getStatusIcon(scraper.status)}
                            <span className="ml-1 capitalize">{scraper.status}</span>
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {scraper.lastRun}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {scraper.leadsScraped.toLocaleString()}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {scraper.avgRuntime}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          {scraper.status === 'running' ? (
                            <button
                              type="button"
                              className="text-yellow-600 hover:text-yellow-900"
                              onClick={() => handleStatusChange(scraper.id, 'paused')}
                            >
                              Pause
                            </button>
                          ) : scraper.status === 'paused' || scraper.status === 'idle' || scraper.status === 'error' ? (
                            <button
                              type="button"
                              className="text-green-600 hover:text-green-900 mr-4"
                              onClick={() => handleStatusChange(scraper.id, 'running')}
                            >
                              Start
                            </button>
                          ) : null}
                          <button
                            type="button"
                            className="text-indigo-600 hover:text-indigo-900"
                            onClick={() => router.push(`/scraper-workers/${scraper.id}`)}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
