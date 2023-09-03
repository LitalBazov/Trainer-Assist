import Admin from '../components/Admin/Admin'
import './Page.css'
 
export default function AdminPage() {
    return (
      <div className='Admin Page'>
        <div className='title'>All Users</div>
          <Admin/>
      </div>
    )
  }