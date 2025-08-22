import { useEffect, useState, useCallback } from "react";
import { getUserListApi } from "../../shared/config/api";
import './homepage.css';

// User type definition with extended properties
interface User {
  _id: string;
  username: string;
  role: string;
  company: string;
  location?: string;
  description?: string;
}

interface ApiResponse {
  users: User[];
  totalCount: number;
  searchTerm: string;
  category: string;
}

// Nepal locations array
const nepalLocations = [
  'Kathmandu', 'Pokhara', 'Lalitpur', 'Bhaktapur', 'Biratnagar',
  'Birgunj', 'Dharan', 'Butwal', 'Hetauda', 'Janakpur',
  'Chitwan', 'Itahari', 'Nepalgunj', 'Dhangadhi', 'Tulsipur',
  'Ghorahi', 'Damak', 'Bharatpur', 'Lumbini', 'Palpa'
];

// Role-based descriptions
const roleDescriptions: Record<string, string[]> = {
  'Designer': [
    'A creative visual designer specializing in modern UI/UX design',
    'An innovative graphic designer with expertise in brand identity',
    'A talented web designer creating stunning digital experiences',
    'A skilled product designer focused on user-centered solutions'
  ],
  'Developer': [
    'A full-stack developer building scalable web applications',
    'A passionate software engineer specializing in modern frameworks',
    'An experienced backend developer creating robust APIs',
    'A frontend specialist crafting beautiful user interfaces'
  ],
  'Photographer': [
    'A professional photographer capturing life\'s precious moments',
    'A creative visual storyteller specializing in portrait photography',
    'An experienced wedding photographer with artistic flair',
    'A commercial photographer focused on brand imagery'
  ],
  'Marketer': [
    'A digital marketing expert driving growth through data-driven strategies',
    'A social media specialist building engaging brand communities',
    'A content marketing professional creating compelling narratives',
    'A performance marketing expert optimizing campaigns for ROI'
  ],
  'Consultant': [
    'A business consultant helping companies achieve strategic goals',
    'A management expert providing operational excellence solutions',
    'A strategy consultant specializing in digital transformation',
    'A process improvement specialist optimizing business workflows'
  ]
};

// Function to get random Nepal location
const getRandomLocation = (): string => {
  return nepalLocations[Math.floor(Math.random() * nepalLocations.length)];
};

// Function to get random description based on role
const getRoleDescription = (role: string): string => {
  const descriptions = roleDescriptions[role] || ['A dedicated professional contributing to their field'];
  return descriptions[Math.floor(Math.random() * descriptions.length)];
};

// Function to enhance user data with location and description
const enhanceUserData = (users: User[]): User[] => {
  return users.map(user => ({
    ...user,
    location: getRandomLocation(),
    description: getRoleDescription(user.role)
  }));
};

const categories = [
  'All',
  'Designer',
  'Developer',
  'Photographer',
  'Marketer',
  'Consultant',
];

// Role icons mapping
const roleIcons: Record<string, string> = {
  'Designer': '🎨',
  'Developer': '💻',
  'Photographer': '📸',
  'Marketer': '📊',
  'Consultant': '💼',
  'Default': '👤'
};

// Company icons mapping  
const companyIcons: Record<string, string> = {
  'Skill': '🎯',
  'Kavya': '🏢',
  'Islington': '🎓',
  'TechCorp': '⚡',
  'DesignStudio': '🎨',
  'CreativeLens': '📷',
  'BusinessPro': '💼',
  'MarketingPro': '📈',
  'CodeCraft': '💻',
  'ArtStudio': '🎭',
  'PhotoPro': '📸',
  'StrategyCorp': '🏆',
  'Default': '🏢'
};

// Function to get role icon
const getRoleIcon = (role: string): string => {
  return roleIcons[role] || roleIcons['Default'];
};

// Function to get company icon
const getCompanyIcon = (company: string): string => {
  return companyIcons[company] || companyIcons['Default'];
};

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
      const enhancedUsers = enhanceUserData(data.users || []);
      setUsers(enhancedUsers);
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
    <div className="homepage-wrapper">
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
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    <span className="loading-spinner"></span>
                    Searching...
                  </span>
                ) : (
                  `${totalCount} result${totalCount !== 1 ? 's' : ''} found`
                )}
                {(debouncedSearch || selectedCategory !== 'All') && (
                  <span style={{ marginLeft: '8px', fontSize: '0.75rem', color: '#9ca3af' }}>
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
                      <div className="role">
                        <span className="role-icon">{getRoleIcon(user.role)}</span>
                        {user.role}
                      </div>
                      <div className="company">
                        <span className="company-icon">{getCompanyIcon(user.company)}</span>
                        {user.company}
                      </div>
                      <div className="location">
                        <span>📍</span>
                        {user.location}
                      </div>
                      <div className="description">
                        {user.description}
                      </div>
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