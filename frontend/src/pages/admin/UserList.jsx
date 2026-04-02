import React, { useState, useEffect } from 'react';
import adminApi from '../../services/adminApi';
import toast from 'react-hot-toast';
import { UserCheck, UserX, Shield, ShieldOff } from 'lucide-react';
import { useSelector } from 'react-redux';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { userInfo } = useSelector((state) => state.user);

  const fetchUsers = async () => {
    try {
      const { data } = await adminApi.get('/users?limit=100');
      setUsers(data.users || data);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleAdmin = async (id) => {
    if (window.confirm('Toggle admin role for this user?')) {
      try {
        await adminApi.put(`/users/${id}/role`);
        toast.success('User role updated');
        fetchUsers();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Update failed');
      }
    }
  };

  const toggleBlock = async (id) => {
    if (window.confirm('Toggle block status for this user?')) {
      try {
        await adminApi.put(`/users/${id}/block`);
        toast.success('User block status updated');
        fetchUsers();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Block failed');
      }
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0f1111]">Users</h1>

      <div className="amz-box shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-[#f3f3f3] text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-5 py-3 font-semibold">User ID</th>
                <th className="px-5 py-3 font-semibold">Name</th>
                <th className="px-5 py-3 font-semibold">Email</th>
                <th className="px-5 py-3 font-semibold text-center">Admin</th>
                <th className="px-5 py-3 font-semibold text-center">Status</th>
                <th className="px-5 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan="6" className="p-5 text-center">Loading...</td></tr>}
              {!loading && Array.isArray(users) && users.map((user) => {
                const isSelf = user._id === userInfo._id;
                
                return (
                  <tr key={user._id} className={`border-b border-[#eee] hover:bg-gray-50 ${user.isBlocked ? 'opacity-60 bg-red-50' : ''}`}>
                    <td className="px-5 py-3 font-mono text-xs">{user._id}</td>
                    <td className="px-5 py-3 font-medium text-[#0f1111]">
                       {user.name} {isSelf && <span className="ml-2 text-xs bg-gray-200 px-2 py-0.5 rounded-full text-gray-700">You</span>}
                    </td>
                    <td className="px-5 py-3"><a href={`mailto:${user.email}`} className="text-blue-600 hover:underline">{user.email}</a></td>
                    <td className="px-5 py-3 text-center">
                      {user.isAdmin ? (
                        <span className="inline-flex text-green-600 bg-green-100 p-1 rounded-full"><Shield size={16} /></span>
                      ) : (
                        <span className="inline-flex text-gray-400 bg-gray-100 p-1 rounded-full"><ShieldOff size={16} /></span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {user.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      {!isSelf && (
                        <div className="flex gap-2 justify-end">
                          <button 
                            onClick={() => toggleAdmin(user._id)} 
                            title={user.isAdmin ? "Remove Admin" : "Make Admin"}
                            className={`p-1.5 rounded-md text-white transition-colors ${user.isAdmin ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-500 hover:bg-blue-600'}`}
                          >
                            {user.isAdmin ? <ShieldOff size={16} /> : <Shield size={16} />}
                          </button>
                          <button 
                            onClick={() => toggleBlock(user._id)} 
                            title={user.isBlocked ? "Unblock User" : "Block User"}
                            className={`p-1.5 rounded-md text-white transition-colors ${user.isBlocked ? 'bg-gray-600 hover:bg-gray-700' : 'bg-red-500 hover:bg-red-600'}`}
                          >
                             {user.isBlocked ? <UserCheck size={16} /> : <UserX size={16} />}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserList;
