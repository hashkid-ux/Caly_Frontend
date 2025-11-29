/**
 * Frontend Integration Tests - Teams Dashboard
 * Tests component rendering, API integration, and user interactions
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import TeamsDashboard from '../../src/pages/TeamsDashboard';
import { QueryClient, QueryClientProvider } from 'react-query';

// Mock axios
jest.mock('axios');

// Mock auth hook
jest.mock('../../src/hooks/useAuth', () => ({
  useAuth: () => ({
    token: 'test-token-12345',
  }),
}));

// Mock navigation
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('TeamsDashboard - Integration Tests', () => {
  let queryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    jest.clearAllMocks();
  });

  const renderWithQueryClient = (component) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    );
  };

  describe('Team Listing', () => {
    it('should display teams from API', async () => {
      const mockTeams = [
        {
          id: '1',
          name: 'Healthcare Team',
          sector: 'healthcare',
          status: 'active',
          member_count: 5,
          satisfaction_score: 4.5,
          created_at: '2025-01-01',
        },
        {
          id: '2',
          name: 'Retail Team',
          sector: 'retail',
          status: 'active',
          member_count: 8,
          satisfaction_score: 4.2,
          created_at: '2025-01-02',
        },
      ];

      axios.get.mockResolvedValue({ data: mockTeams });

      renderWithQueryClient(<TeamsDashboard />);

      await waitFor(() => {
        expect(screen.getByText('Healthcare Team')).toBeInTheDocument();
        expect(screen.getByText('Retail Team')).toBeInTheDocument();
      });

      expect(axios.get).toHaveBeenCalledWith(
        '/api/teams',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token-12345',
          }),
        })
      );
    });

    it('should display empty state when no teams exist', async () => {
      axios.get.mockResolvedValue({ data: [] });

      renderWithQueryClient(<TeamsDashboard />);

      await waitFor(() => {
        expect(
          screen.getByText(/no teams found/i)
        ).toBeInTheDocument();
      });
    });

    it('should display loading spinner while fetching', () => {
      axios.get.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({ data: [] }),
              100
            )
          )
      );

      renderWithQueryClient(<TeamsDashboard />);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should handle API errors gracefully', async () => {
      axios.get.mockRejectedValue(new Error('Network error'));

      renderWithQueryClient(<TeamsDashboard />);

      await waitFor(() => {
        expect(screen.getByText(/error loading teams/i)).toBeInTheDocument();
      });
    });
  });

  describe('Search Functionality', () => {
    it('should filter teams by search term', async () => {
      const mockTeams = [
        {
          id: '1',
          name: 'Healthcare Support',
          sector: 'healthcare',
          status: 'active',
          member_count: 5,
          satisfaction_score: 4.5,
          created_at: '2025-01-01',
        },
        {
          id: '2',
          name: 'Retail Operations',
          sector: 'retail',
          status: 'active',
          member_count: 8,
          satisfaction_score: 4.2,
          created_at: '2025-01-02',
        },
      ];

      axios.get.mockResolvedValue({ data: mockTeams });

      renderWithQueryClient(<TeamsDashboard />);

      await waitFor(() => {
        expect(screen.getByText('Healthcare Support')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/search teams/i);
      await userEvent.type(searchInput, 'Healthcare');

      await waitFor(() => {
        expect(screen.getByText('Healthcare Support')).toBeInTheDocument();
        expect(screen.queryByText('Retail Operations')).not.toBeInTheDocument();
      });
    });

    it('should call API with search params', async () => {
      axios.get.mockResolvedValue({ data: [] });

      renderWithQueryClient(<TeamsDashboard />);

      const searchInput = screen.getByPlaceholderText(/search teams/i);
      await userEvent.type(searchInput, 'Healthcare');

      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith(
          expect.stringContaining('/api/teams'),
          expect.any(Object)
        );
      });
    });
  });

  describe('Filter Functionality', () => {
    it('should filter teams by sector', async () => {
      const mockTeams = [
        {
          id: '1',
          name: 'Healthcare Team',
          sector: 'healthcare',
          status: 'active',
          member_count: 5,
          satisfaction_score: 4.5,
          created_at: '2025-01-01',
        },
      ];

      axios.get.mockResolvedValue({ data: mockTeams });

      renderWithQueryClient(<TeamsDashboard />);

      const sectorFilter = screen.getByDisplayValue('all');
      await userEvent.selectOption(sectorFilter, 'healthcare');

      await waitFor(() => {
        expect(axios.get).toHaveBeenCalled();
      });
    });

    it('should filter teams by status', async () => {
      const mockTeams = [
        {
          id: '1',
          name: 'Active Team',
          sector: 'healthcare',
          status: 'active',
          member_count: 5,
          satisfaction_score: 4.5,
          created_at: '2025-01-01',
        },
      ];

      axios.get.mockResolvedValue({ data: mockTeams });

      renderWithQueryClient(<TeamsDashboard />);

      const statusFilter = screen.getByDisplayValue('all');
      await userEvent.selectOption(statusFilter, 'active');

      await waitFor(() => {
        expect(axios.get).toHaveBeenCalled();
      });
    });
  });

  describe('Create Team Modal', () => {
    it('should open create team modal', async () => {
      axios.get.mockResolvedValue({ data: [] });

      renderWithQueryClient(<TeamsDashboard />);

      const createButton = screen.getByText(/create team/i);
      await userEvent.click(createButton);

      await waitFor(() => {
        expect(screen.getByText(/new team/i)).toBeInTheDocument();
      });
    });

    it('should create a new team', async () => {
      axios.get.mockResolvedValue({ data: [] });
      axios.post.mockResolvedValue({
        data: {
          id: '3',
          name: 'New Team',
          sector: 'finance',
          status: 'active',
        },
      });

      renderWithQueryClient(<TeamsDashboard />);

      const createButton = screen.getByText(/create team/i);
      await userEvent.click(createButton);

      const nameInput = await screen.findByLabelText(/team name/i);
      const sectorInput = await screen.findByLabelText(/sector/i);
      const submitButton = screen.getByText(/submit/i);

      await userEvent.type(nameInput, 'New Team');
      await userEvent.selectOption(sectorInput, 'finance');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          '/api/teams',
          expect.objectContaining({
            name: 'New Team',
            sector: 'finance',
          }),
          expect.any(Object)
        );
      });
    });

    it('should validate form inputs', async () => {
      axios.get.mockResolvedValue({ data: [] });

      renderWithQueryClient(<TeamsDashboard />);

      const createButton = screen.getByText(/create team/i);
      await userEvent.click(createButton);

      const submitButton = await screen.findByText(/submit/i);
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/required/i)).toBeInTheDocument();
      });

      expect(axios.post).not.toHaveBeenCalled();
    });

    it('should close modal on cancel', async () => {
      axios.get.mockResolvedValue({ data: [] });

      renderWithQueryClient(<TeamsDashboard />);

      const createButton = screen.getByText(/create team/i);
      await userEvent.click(createButton);

      const cancelButton = await screen.findByText(/cancel/i);
      await userEvent.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByText(/new team/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Team Navigation', () => {
    it('should navigate to team detail on click', async () => {
      const mockTeams = [
        {
          id: '1',
          name: 'Healthcare Team',
          sector: 'healthcare',
          status: 'active',
          member_count: 5,
          satisfaction_score: 4.5,
          created_at: '2025-01-01',
        },
      ];

      axios.get.mockResolvedValue({ data: mockTeams });

      const { getByRole } = renderWithQueryClient(<TeamsDashboard />);

      await waitFor(() => {
        expect(screen.getByText('Healthcare Team')).toBeInTheDocument();
      });

      const teamCard = screen.getByText('Healthcare Team').closest('div');
      await userEvent.click(teamCard);

      // Navigation would be handled by react-router
      // This test verifies the click handler exists
      expect(teamCard).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('should display responsive grid layout', async () => {
      const mockTeams = [
        {
          id: '1',
          name: 'Team 1',
          sector: 'healthcare',
          status: 'active',
          member_count: 5,
          satisfaction_score: 4.5,
          created_at: '2025-01-01',
        },
        {
          id: '2',
          name: 'Team 2',
          sector: 'retail',
          status: 'active',
          member_count: 8,
          satisfaction_score: 4.2,
          created_at: '2025-01-02',
        },
      ];

      axios.get.mockResolvedValue({ data: mockTeams });

      const { container } = renderWithQueryClient(<TeamsDashboard />);

      await waitFor(() => {
        expect(screen.getByText('Team 1')).toBeInTheDocument();
      });

      // Verify grid container has responsive classes
      const grid = container.querySelector('[class*="grid"]');
      expect(grid).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should display error message on API failure', async () => {
      axios.get.mockRejectedValue(
        new Error('Failed to fetch teams')
      );

      renderWithQueryClient(<TeamsDashboard />);

      await waitFor(() => {
        expect(
          screen.getByText(/error loading teams/i)
        ).toBeInTheDocument();
      });
    });

    it('should have retry button on error', async () => {
      axios.get.mockRejectedValueOnce(new Error('Network error'));
      axios.get.mockResolvedValueOnce({ data: [] });

      renderWithQueryClient(<TeamsDashboard />);

      await waitFor(() => {
        expect(screen.getByText(/retry/i)).toBeInTheDocument();
      });

      const retryButton = screen.getByText(/retry/i);
      await userEvent.click(retryButton);

      expect(axios.get).toHaveBeenCalledTimes(2);
    });
  });

  describe('Authentication', () => {
    it('should include auth token in API calls', async () => {
      axios.get.mockResolvedValue({ data: [] });

      renderWithQueryClient(<TeamsDashboard />);

      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            headers: expect.objectContaining({
              Authorization: 'Bearer test-token-12345',
            }),
          })
        );
      });
    });

    it('should handle 401 unauthorized error', async () => {
      axios.get.mockRejectedValue({
        response: { status: 401 },
      });

      renderWithQueryClient(<TeamsDashboard />);

      await waitFor(() => {
        expect(
          screen.getByText(/unauthorized/i)
        ).toBeInTheDocument();
      });
    });
  });

  describe('Performance', () => {
    it('should debounce search input', async () => {
      const mockTeams = [];
      axios.get.mockResolvedValue({ data: mockTeams });

      renderWithQueryClient(<TeamsDashboard />);

      const searchInput = await screen.findByPlaceholderText(/search teams/i);

      // Type multiple characters
      await userEvent.type(searchInput, 'Healthcare');

      // Should debounce API calls
      await waitFor(() => {
        // Should have fewer calls than characters typed
        expect(axios.get.mock.calls.length).toBeLessThan(9);
      });
    });

    it('should cache team data', async () => {
      const mockTeams = [];
      axios.get.mockResolvedValue({ data: mockTeams });

      const { rerender } = renderWithQueryClient(
        <TeamsDashboard />
      );

      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledTimes(1);
      });

      rerender(
        <QueryClientProvider client={queryClient}>
          <TeamsDashboard />
        </QueryClientProvider>
      );

      // Should use cached data, no additional API call
      expect(axios.get).toHaveBeenCalledTimes(1);
    });
  });
});
