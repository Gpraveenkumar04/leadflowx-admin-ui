import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

/**
 * Authentication wrapper for API routes
 * Validates that a user is authenticated before allowing access to the API
 */
export function withApiAuth(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // For local development and testing, bypass auth check with a special header
      if (process.env.NODE_ENV === 'development' && req.headers['x-bypass-auth'] === 'true') {
        return handler(req, res);
      }
      
      // Get the session from next-auth
      const session = await getSession({ req });
      
      // If no session exists, user is not authenticated
      if (!session) {
        return res.status(401).json({
          error: 'Not authenticated',
          message: 'You must be signed in to access this endpoint'
        });
      }
      
      // User is authenticated, proceed with the API request
      return handler(req, res);
    } catch (error) {
      console.error('Authentication error:', error);
      return res.status(500).json({
        error: 'Authentication error',
        message: 'An error occurred during authentication'
      });
    }
  };
}

/**
 * Role-based authentication wrapper for API routes
 * Validates that a user has the required roles before allowing access to the API
 */
export function withApiAuthRoles(handler: NextApiHandler, allowedRoles: string[]) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // For local development and testing, bypass auth check with a special header
      if (process.env.NODE_ENV === 'development' && req.headers['x-bypass-auth'] === 'true') {
        return handler(req, res);
      }
      
      // Get the session from next-auth
      const session = await getSession({ req });
      
      // If no session exists, user is not authenticated
      if (!session) {
        return res.status(401).json({
          error: 'Not authenticated',
          message: 'You must be signed in to access this endpoint'
        });
      }
      
      // Check if user has the required roles
      const userRoles = session.user?.roles || [];
      const hasRequiredRole = allowedRoles.some(role => userRoles.includes(role));
      
      if (!hasRequiredRole) {
        return res.status(403).json({
          error: 'Insufficient permissions',
          message: 'You do not have the required permissions to access this endpoint'
        });
      }
      
      // User is authenticated and has required roles, proceed with the API request
      return handler(req, res);
    } catch (error) {
      console.error('Authentication error:', error);
      return res.status(500).json({
        error: 'Authentication error',
        message: 'An error occurred during authentication'
      });
    }
  };
}
