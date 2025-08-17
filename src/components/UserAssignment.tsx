import React, { useState, useEffect } from 'react';
import { t } from '../../src/i18n';
import { UsersIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { User } from '@/types';

interface UserAssignmentProps {
  currentAssigneeId?: string;
  onAssign: (userId: string) => void;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const UserAssignment: React.FC<UserAssignmentProps> = ({
  currentAssigneeId,
  onAssign,
  label = 'Assign to',
  size = 'md',
  showLabel = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Load users from API; show empty-state if unavailable
  useEffect(() => {
    let ignore = false;
    const load = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/users`, {
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        });
        if (!res.ok) throw new Error('Failed to fetch users');
        const data = await res.json();
        if (!ignore) setUsers(Array.isArray(data?.data) ? data.data : []);
      } catch {
        if (!ignore) setUsers([]);
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };
    load();
    return () => { ignore = true; };
  }, []);

  const handleAssign = (userId: string) => {
    onAssign(userId);
    setIsOpen(false);
  };

  const getCurrentAssignee = () => {
    if (!currentAssigneeId) return null;
    return users.find(user => user.id === currentAssigneeId);
  };

  const filteredUsers = searchTerm
    ? users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : users;

  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base'
  };

  const currentUser = getCurrentAssignee();
  
  return (
    <div className="relative inline-block text-left">
      <div className="flex items-center">
        {showLabel && (
          <span className="text-sm text-gray-500 mr-2">{label}:</span>
        )}
        
        {currentUser ? (
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-2 px-3 py-1 rounded-full border hover:bg-gray-50"
          >
            {currentUser.avatar ? (
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name}
                className={`rounded-full ${sizeClasses[size]}`}
              />
            ) : (
              <div className={`rounded-full bg-primary-100 flex items-center justify-center ${sizeClasses[size]}`}>
                <span className="font-medium text-primary-800">
                  {currentUser.name.substring(0, 2).toUpperCase()}
                </span>
              </div>
            )}
            <span>{currentUser.name}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-1 text-sm text-gray-700 border border-gray-300 rounded-md px-2.5 py-1.5 bg-white hover:bg-gray-50"
          >
            <UsersIcon className="h-4 w-4" />
            <span>{t('user.assign')}</span>
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="p-2">
            <div className="mb-2">
              <input
                type="text"
                placeholder={t('user.search.placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            {isLoading ? (
              <div className="py-2 px-3 text-center">Loading users...</div>
            ) : filteredUsers.length === 0 ? (
                <div className="py-2 px-3 text-center text-gray-500">{t('user.search.no_results')}</div>
            ) : (
              <div className="max-h-60 overflow-y-auto">
                {filteredUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleAssign(user.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm rounded-md hover:bg-gray-100 ${
                      currentAssigneeId === user.id ? 'bg-gray-100' : ''
                    }`}
                  >
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="h-6 w-6 rounded-full mr-2"
                      />
                    ) : (
                      <div className="h-6 w-6 rounded-full bg-primary-100 flex items-center justify-center mr-2">
                        <span className="text-xs font-medium text-primary-800">
                          {user.name.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span className="flex-1 text-left">{user.name}</span>
                    {currentAssigneeId === user.id && (
                      <CheckIcon className="h-4 w-4 text-primary-600" />
                    )}
                  </button>
                ))}
              </div>
            )}
            
            {currentAssigneeId && (
              <div className="mt-2 pt-2 border-t border-gray-100">
                <button
                  onClick={() => handleAssign('')}
                  className="w-full flex items-center px-3 py-2 text-sm text-red-600 rounded-md hover:bg-red-50"
                >
                  <XMarkIcon className="h-4 w-4 mr-2" />
                  {t('user.assign.remove')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAssignment;
