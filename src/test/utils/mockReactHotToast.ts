// Shared jest mock for react-hot-toast used by tests.
// Importing this module in a test file will register the mock and
// expose the `toast` object for assertions.
const toast = {
  success: jest.fn(),
  error: jest.fn(),
  loading: jest.fn(),
  dismiss: jest.fn(),
  custom: jest.fn(),
  // Allow calling toast() as a shorthand in some code paths
  __call: jest.fn(),
};

// Provide both default export and named export for compatibility
jest.mock('react-hot-toast', () => ({ __esModule: true, default: toast, toast }));

export { toast };
export default toast;
