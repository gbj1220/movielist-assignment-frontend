import React, { Component } from "react";
import axios from "axios";

export class Movie extends Component {
  state = {
    movieInput: "",
    movieList: [],
    isToggle: false,
    updatedInput: "",
  };

  componentDidMount = async () => {
    try {
      let allMovies = await axios.get(
        "http://localhost:3000/movies/get-all-movies"
      );
      this.setState({
        movieList: allMovies.data.data,
      });
    } catch (e) {
      console.log(e);
    }
  };

  handleMovieInputOnChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleMovieSubmit = async () => {
    try {
      let createdMovie = await axios.post(
        "http://localhost:3000/movies/create-movie",
        { movie: this.state.movieInput }
      );

      let newCreatedMovieArray = [
        ...this.state.movieList,
        createdMovie.data.data,
      ];

      this.setState({
        movieList: newCreatedMovieArray,
        movieInput: "",
      });
    } catch (e) {
      console.log(e);
    }
  };

  handleDeleteMovieByParams = async (id) => {
    try {
      let deleteMovie = await axios.delete(
        `http://localhost:3000/movies/delete-movie/${id}`
      );

      let newDeletedMovieList = this.state.movieList.filter(
        (item) => item._id !== deleteMovie.data.data._id
      );

      this.setState({
        movieList: newDeletedMovieList,
      });
    } catch (e) {
      console.log(e);
    }
  };

  updateOnChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleUpdateByID = async (movie) => {
    this.setState((prevState) => {
      return {
        isToggle: !prevState.isToggle,
        updatedInput: movie.movie,
      };
    });

    try {
      let updatedMovie = await axios.put(
        `http://localhost:3000/movies/edit-movie/${movie._id}`,
        {
          movie: this.state.updatedInput,
        }
      );

      let updatedMovieList = this.state.movieList.map((item) => {
        if (item.id === updatedMovie.data.data._id) {
          item.movie = updatedMovie.data.data.movie;
        }
        return item;
      });

      this.setState({
        movieList: updatedMovieList,
      });
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    return (
      <div style={{ marginTop: 20, textAlign: "center" }}>
        <div style={{ marginTop: 50 }}>
          <input
            style={{ width: 300 }}
            type='text'
            name='movieInput'
            value={this.state.movieInput}
            onChange={this.handleMovieInputOnChange}
          />
        </div>
        <br />
        <button
          style={{ margin: "25px 25px" }}
          onClick={this.handleMovieSubmit}
          className='btn btn-outline-success'
        >
          Submit
        </button>
        <br />
        {this.state.movieList.map((item, index) => {
          return (
            <div key={item._id}>
              {this.state.isToggle ? (
                <input
                  type='text'
                  name='updatedInput'
                  value={this.state.updatedInput}
                  onChange={this.updateOnChange}
                />
              ) : (
                <span style={{ margin: "10px" }}>{item.movie}</span>
              )}

              <button
                onClick={() => this.handleUpdateByID(item, index)}
                style={{ margin: "10px" }}
                className='btn btn-outline-info'
              >
                Edit
              </button>

              <button
                onClick={() => this.handleDeleteMovieByParams(item._id)}
                style={{ margin: "10px" }}
                className='btn btn-outline-danger'
              >
                Delete
              </button>
            </div>
          );
        })}
      </div>
    );
  }
}

export default Movie;
