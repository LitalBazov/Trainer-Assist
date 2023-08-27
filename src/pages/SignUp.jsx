import SignUpForm from '../components/SignUpForm/SignUpForm' 
import './Page.css'
 
export default function SignUpPage() {
    return (
      <div className='SignUp Page'>
        <div className='title'>Sign Up</div>
          <SignUpForm/>
      </div>
    )
  }