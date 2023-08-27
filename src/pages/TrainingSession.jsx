import CreateSession from '../components/CreateTrainingRequest/TrainingSession'
import './Page.css'
import { useParams } from 'react-router-dom'


export default function TrainingSessionPage() {
    const { trainerId } = useParams();
      
  return (
    <div className='TrainingSession Page'>
        <div className='title'>Training Session Page</div>
        
        <CreateSession trainer={trainerId}/>
    </div>
  )
}