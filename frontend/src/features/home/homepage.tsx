import { useEffect, useState } from "react";
import { getUserListApi } from "../../shared/config/api";
import './homepage.css';

// User type definition
interface User {
  _id: string;
  username: string;
  role: string;
  company: string;
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
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentUser, setCurrentUser] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch user list from API
    setLoading(true);
    setError(null);
    
    getUserListApi()
      .then((res) => {
        const userData = res.data.users || [];
        setUsers(userData);
        setFilteredUsers(userData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching users:', err);
        setError('Failed to load users. Please try again.');
        setUsers([]);
        setFilteredUsers([]);
        setLoading(false);
      });

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
  }, []);

  useEffect(() => {
    let filtered = users;
    
    // Apply category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter((u) => 
        u.role && u.role.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    // Apply search filter
    if (search.trim()) {
      const searchTerm = search.toLowerCase().trim();
      filtered = filtered.filter((u) =>
        (u.username && u.username.toLowerCase().includes(searchTerm)) ||
        (u.role && u.role.toLowerCase().includes(searchTerm)) ||
        (u.company && u.company.toLowerCase().includes(searchTerm))
      );
    }
    
    setFilteredUsers(filtered);
  }, [search, selectedCategory, users]);

  if (loading) {
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
            <button className="nav-button">My Network</button>
            <button className="nav-button">Jobs</button>
            <button className="nav-button">Messaging</button>

            
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
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="category-buttons">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`category-button ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
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
                {filteredUsers.length} result{filteredUsers.length !== 1 ? 's' : ''} found
              </div>
              
              {filteredUsers.length === 0 ? (
                <div className="empty-state">
                  <h3>No users found</h3>
                  <p>Try adjusting your search or filter criteria.</p>
                </div>
              ) : (
                <div className="user-card-grid">
                  {filteredUsers.map((user) => (
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
