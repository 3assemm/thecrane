// Update the users state initialization
const [users, setUsers] = useState<UserProfile[]>([]);

// Update the useEffect hook
useEffect(() => {
  const fetchUsers = async () => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const userProfiles = await getAllUserPreferences();
      setUsers(userProfiles || []); // Ensure we always have an array
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
      setUsers([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  fetchUsers();
}, [isAdmin]);

// Update the filtering logic
const filteredUsers = users?.filter(user => {
  if (!user?.email || !user?.displayName) return false;
  
  const searchMatch = 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.displayName.toLowerCase().includes(searchTerm.toLowerCase());
  return searchMatch;
}) || [];
