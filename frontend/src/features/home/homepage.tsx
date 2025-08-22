import { useEffect, useState, useCallback } from "react";
import { getUserListApi } from "../../shared/config/api";
import './homepage.css';

// User type definition
interface User {
  _id: string;
  username: string;
  role: string;
  company: string;
}

interface ApiResponse {
  users: User[];
  totalCount: number;
  searchTerm: string;
  category: string;
}

const categories = [
  'All',
  'Designer',
  'Developer',
  'Photographer',
  'Marketer',
  'Consultant',
];

const Homepage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentUser, setCurrentUser] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  // Debounce function to avoid too many API calls while typing
  const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  };

  const debouncedSearch = useDebounce(search, 300); // 300ms delay

  // Memoized fetch function
  const fetchUsers = useCallback(async (searchTerm: string, category: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getUserListApi({
        search: searchTerm,
        category: category
      });
      
      const data: ApiResponse = response.data;
      setUsers(data.users || []);
      setTotalCount(data.totalCount || 0);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again.');
      setUsers([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    // Get current user from localStorage
    const userStr = localStorage.getItem('currentuser');
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        setCurrentUser(userObj.username || '');
      } catch {
        setCurrentUser('');
      }
    }
    
    // Initial fetch
    fetchUsers('', 'All');
  }, [fetchUsers]);

  // Fetch when search or category changes
  useEffect(() => {
    fetchUsers(debouncedSearch, selectedCategory);
  }, [debouncedSearch, selectedCategory, fetchUsers]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  if (loading && users.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-300 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-300 p-0 m-0">
      <header>
        <div className="header-content">
          <h1 className="header-title">
            Welcome back, <span className="user-name">{currentUser || 'User'}</span>
          </h1>

          <nav className="nav-menu">
            <button className="nav-button">Home</button>
            <button 
              className="nav-button"
              onClick={() => window.location.href = "/profile"}
            >
              Profile
            </button>
            
            <button
              className="nav-button logout-button"
              onClick={() => {
                localStorage.removeItem('currentuser');
                window.location.href = "/";
              }}
            >
              Logout
            </button>
          </nav>
        </div>
      </header>
      
      <main className="main-container">
        <div className="search-filter-section">
          <div className="search-filter-container">
            <input
              type="text"
              placeholder="Search by name, role, or company..."
              className="search-input"
              value={search}
              onChange={handleSearchChange}
            />
            <div className="category-buttons">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`category-button ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="results-section">
          {error ? (
            <div className="empty-state">
              <h3>Error</h3>
              <p>{error}</p>
            </div>
          ) : (
            <>
              <div className="result-count">
                {loading ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                    Searching...
                  </span>
                ) : (
                  `${totalCount} result${totalCount !== 1 ? 's' : ''} found`
                )}
                {(debouncedSearch || selectedCategory !== 'All') && (
                  <span className="ml-2 text-sm text-gray-500">
                    {debouncedSearch && `for "${debouncedSearch}"`}
                    {debouncedSearch && selectedCategory !== 'All' && ' '}
                    {selectedCategory !== 'All' && `in ${selectedCategory}`}
                  </span>
                )}
              </div>
              
              {!loading && users.length === 0 ? (
                <div className="empty-state">
                  <h3>No users found</h3>
                  <p>
                    {debouncedSearch || selectedCategory !== 'All' 
                      ? 'Try adjusting your search or filter criteria.'
                      : 'No users are available at the moment.'
                    }
                  </p>
                </div>
              ) : (
                <div className="user-card-grid">
                  {users.map((user) => (
                    <div
                      key={user._id}
                      className="user-card"
                      onClick={() => {/* TODO: navigate to user profile */}}
                    >
                      <div className="username">{user.username}</div>
                      <div className="role">{user.role}</div>
                      <div className="company">{user.company}</div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Homepage;