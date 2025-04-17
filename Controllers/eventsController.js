const eventsModel = require('../Models/Event');


const eventsController = {

    getAllEvents:async(req,res)=>{
        try{
            const events = eventsModel.find();
            return res.status(200).json(events);
        }
        catch(err){
            return res.stasus(500).message("Server Error")
        }
    },
    

}