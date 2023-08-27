const express = require('express');
const router = express.Router();
 const {insertTrainingRequest, getTraineeTrainingsList,cancelTrainingRequest
    ,getTraineeTrainingListByStatus,getTrainerTrainingsList,
    getTrainerTrainingListByStatus,changeStatusTrainingRequest}=require('../controllers/trainingRequestController');
const { authenticateUser, authorizeUser } = require('../middleware/authentication');

// פעולות על קולקשיין בקשות לאימון
//מנקודת מבט של מתאמן 
    //מתאמן רוצה לראות את כל האימונים שלו       
router.get('/trainee/:id',authenticateUser, authorizeUser(['user','trainer']), getTraineeTrainingsList);

    // מתאמן רוצה לראות את כל האימונים שלו שהסטטוס בהם ספציפי למה שביקש
 router.get('/trainee/:id/:status', authenticateUser, authorizeUser(['user']),getTraineeTrainingListByStatus);
 //מנקודת המבט של המאמן
 
 //הצג את כל האימונים לפי מאמן
 router.get('/trainer/:id', authenticateUser, authorizeUser(['trainer']),getTrainerTrainingsList);
     
 //מאמן רוצה לראות את כל האימונים שלו שהסטטוס בהם ספציפי למה שביקש
router.get('/trainer/:id/:status', authenticateUser, authorizeUser(['trainer']),getTrainerTrainingListByStatus);

    //מתאמן רוצה ליצור בקשה לאימון
router.post('/trainee/:id',authenticateUser, authorizeUser(['user']), insertTrainingRequest);
    //מתאמן רוצה לבטל בקשה
 router.put('/trainee/:id',authenticateUser, authorizeUser(['user']),cancelTrainingRequest);
    //אדמין רוצה למחוק בקשה
 //router.put('/trainee/:id',authenticateUser, authorizeUser(['user']),deleteTrainingRequest);

    //מאמן רוצה לשנות סטטוס בקשה
    router.put('/trainer/:id', authenticateUser, authorizeUser(['trainer']),changeStatusTrainingRequest);

module.exports = router;




//הפרמטר שאני נותנת אחרי הסלש הם משמשים לסינון או מיון נתונים





