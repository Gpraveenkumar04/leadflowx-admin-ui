// Global jest setup: register shared react-hot-toast mock for all tests
// Keep this file minimal; tests can still require/import the mock explicitly if needed.
import './src/test/utils/mockReactHotToast';
import '@testing-library/jest-dom';
/// <reference types="@types/jest" />
import { server } from './src/test/msw/server';

// Mock Next.js router for hooks relying on useRouter
jest.mock('next/router', () => ({
	useRouter: () => ({
		query: {},
		pathname: '/leads',
		push: jest.fn(),
		replace: jest.fn(),
		prefetch: jest.fn(),
		isReady: true,
		events: { on: jest.fn(), off: jest.fn() }
	})
}));

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
