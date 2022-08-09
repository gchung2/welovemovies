const db = require("../db/connection");
const theatersServices = require("./theaters.service");

async function listTheaters(request, response, next) {
    const { movieId } = request.params;
    if (movieId) {
        const theaters = await theatersServices.listTheatersByMovieID(movieId);
        response.json({ data: theaters})
    }
    
    const theaters = await theatersServices.listTheaters();
    for (let i = 0; i < theaters.length; i++) {
        const movies = await theatersServices.listMoviesByTheaters(theaters[i].theater_id);
        theaters[i]["movies"] = movies
    }
    response.json({ data: theaters })
}

module.exports = {
    list: [listTheaters],
}
