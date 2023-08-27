import TrainingSessionsTrainee  from '../components/TrainingSessionsTrainee/TrainingSessionsTrainee'
import './Page.css'
import { useParams } from 'react-router-dom'


export default function TrainingSessionPage() {
      
  return (
    <div className='TrainingSession Page'>
        <div className='title'>Training Session Page</div>
        <TrainingSessionsTrainee/>
    </div>
  )
}