import React, { useEffect, useState , useContext } from "react";
import { getAllUsers, deleteUser } from "../../services/adminService"; // Import the delete user service
import { Link } from "react-router-dom";
import { faEdit, faTrash  } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './Admin.css'
import { AuthContext } from '../../context/authContex';

export default function Admin() {
  const [users, setUsers] = useState(null);
  const { userData } = useContext(AuthContext);


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

  return (
    <div className="user-management-container">
  {userData ? (
    <>
      <div className="table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Phone</th>
              <th>City</th>
              <th>Age</th>
              <th>Name</th>
              <th>Role</th>
              <th colSpan="2" style={{ textAlign: 'center' }}>Actions</th>
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
                  <td>{user.age}</td>
                  <td>{user.firstName} {user.lastName}</td>
                  <td>{user.role}</td>
                  <td>
                    <button className="delete-button" onClick={() => handleDeleteUser(user._id)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                  <td>
                    <Link to={`/users/admin/${user._id}`} className="edit-link"> <FontAwesomeIcon icon={faEdit}/></Link>
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
      <div className="createUser">
        <Link to="/admin/createuser">Create new User</Link>
      </div>
    </>
  ) : (
    <div className='NoToken'>
      The connection has been disconnected. Please{' '}
      <Link to="/">
        <button id="signinButton">Sign in</button>
      </Link>
    </div>
  )}
</div>

  );
      }  