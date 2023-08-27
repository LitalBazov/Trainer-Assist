import React, { useEffect, useState } from "react";
import { getAllUsers, deleteUser } from "../../services/adminService"; // Import the delete user service
import jwtDecode from "jwt-decode";
import { useContext } from "react";
import { AuthContext } from "../../context/authContex";
import { Link } from "react-router-dom";

export default function AdminPage() {
  const [users, setUsers] = useState(null);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await getAllUsers();
        const usersArray = response.data.data;
        // Filter out admin user from the list
        const filteredUsers = usersArray.filter(
          (user) => user.role !== "admin"
        );
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching all users:", error);
      }
    };
    fetchAllUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      // Call the delete user service with the user ID
      await deleteUser(userId);
      // After successful deletion, update the users list
      const updatedUsers = users.filter((user) => user._id !== userId);
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
  const handleUpdateUser = async () => {
    try {
      const response = await getAllUsers();
      const usersArray = response.data.data;
      const filteredUsers = usersArray.filter((user) => user.role !== "admin");
      setUsers(filteredUsers);
    } catch (error) {
      console.error("Error fetching updated users:", error);
    }
  };

  return (
    <div>
      <h2>All Users</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Phone</th>
            <th>City</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
  {users ? (
    users.map((user) => (
      <tr key={user._id}>
        <td>{user._id}</td>
        <td>{user.email}</td>
        <td>{user.phone}</td>
        <td>{user.city}</td>
        <td>{user.firstName} {user.lastName}</td>
        <td>
          <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
        </td>
        <td>
          <Link to={`/users/admin/${user._id}`}>Edit</Link>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="7">Loading users...</td>
    </tr>
  )}
</tbody>

        
      </table>
    </div>
  );
}
