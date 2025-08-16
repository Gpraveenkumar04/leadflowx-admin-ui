// Shared jest mock for react-hot-toast used by tests.
// Importing this module in a test file will register the mock and
// expose the `toast` object for assertions.
const toast = {
  success: jest.fn(),
  error: jest.fn(),
  loading: jest.fn(),
  dismiss: jest.fn(),
  custom: jest.fn(),
};

// Register the jest mock for the module name used in the app
jest.mock('react-hot-toast', () => ({ toast }));

export { toast };
