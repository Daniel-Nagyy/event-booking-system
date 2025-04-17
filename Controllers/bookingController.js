const bookingModel = require('../Models/Booking');


const bookingController = {

    getBooking:async(req,res)=>{
        try{
            const bookingID = req.params.bookingID
            if(!bookingID) return res.status(400).message("null ID");

            booking = await bookingModel.findById(req.params.bookingID)
            if(!booking) return res.status(404).message("booking not found")
            return res.stasus(200).json(booking);
        }
        catch(err){
            return res.stasus(500).message("Server Error")
        }
    },
    

}