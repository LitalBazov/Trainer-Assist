import CreateTrainingRequest from '../components/CreateTrainingRequest/CreateTrainingRequest'
import './Page.css'
import { useParams } from 'react-router-dom'


export default function CreateTrainingRequestPage() {
    const { trainerId } = useParams();
      
  return (
    <div className='CreateTrainingRequest Page'>
        <div className='title'>Create Training Request</div>
        
        <CreateTrainingRequest trainer={trainerId}/>
    </div>
  )
}