pragma solidity >= 0.7.0 < 0.9.0;

/*

Struct types are used to represent a record.

Are like Objects.

*/

contract Structures {
    
    // Keep track of the movies we have and put all information relevant to the movies
    struct Movie {
        string title;
        string director;
        uint movieId;
    }
    
    // make a movie variable by assigning it the data type of the struct - instance
    Movie movie;
    
    // Adding information to a struct
    function setMovie() public {
        movie = Movie("Movie Title 1", "Director 1", 1);
    }
    
    function getMovieId() public view returns(uint) {
        return movie.movieId;
    }
    
}
