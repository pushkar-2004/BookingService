const axios = require('axios');
const {BookingRepository} = require('../repository/index');
const { FLIGHT_SERVICE_PATH } = require('../config/serverConfig');
const {ServiceError} = require('../utils/errors/index');

class BookingService{
    constructor(){
        this.bookingRepository = new BookingRepository();
    }
    async createBooking(data){
        try {
            const flightId = data.flightId;
            const getFlightRequestURL=`${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
            const response =await  axios.get(getFlightRequestURL);
            const flightData = response.data.data;
            let priceOfFlight = flightData.price;
            const seatsLeft = flightData.totalSeats - Number(data.noOfSeats);
            if(seatsLeft<0){
                throw new ServiceError('Something went wrong in the booking process','Insufficient seats');
            }
            const totalCost = priceOfFlight * data.noOfSeats;
            const bookingPayload = {...data,totalCost};
            const booking = await this.bookingRepository.create(bookingPayload);
            const updateFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
            await axios.patch(updateFlightRequestURL,{totalSeats:seatsLeft});
            const finalBooking=await this.bookingRepository.update(booking.id,{status:'Booked'});
            return finalBooking;
        } catch (error) {
            if(error.name=='RepositoryError' || error.name=='ValidationError'){
                throw error;
            }
            throw new ServiceError();
        }
    }


}

module.exports = BookingService;