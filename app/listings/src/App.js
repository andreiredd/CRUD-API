import './App.css';
import TinderCard from 'react-tinder-card';
import axios from 'axios';
import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import { v4 as uuid } from 'uuid';

class App extends Component {
  constructor() {
    super();

    this.state = {
      data: [],
      session_id: uuid(),
      liked: false,
    };
    this.handleClick = this.handleClick.bind(this);
    this.showDetails = this.showDetails.bind(this);
  }

  async onSwipe(direction, listingId, sessionId) {
    this.setState({
      liked: false,
    });

    if (direction === 'left') {
      await axios.delete(`http://localhost:5000/listings/delete/${listingId}`);
    } else {
      await axios.post('http://localhost:5000/listings/recordSwipe', {
        id: listingId,
        session_id: sessionId,
        direction,
      });
      await axios.put(`http://localhost:5000/listings/put/${listingId}`);
    }
  }

  async handleClick(listingId) {
    this.setState({
      liked: !this.state.liked,
    });

    await axios.post('http://localhost:5000/listings/updateLike', {
      id: listingId,
    });
  }

  async handleClick2(listingId) {
    document.getElementById("form").display = "block";
    await axios.patch('http://localhost:5000/listings/patch', {
      id: listingId,
    });
  }

  showDetails(listing) {
    alert(
      `Title: ${listing.title}\nPlot: ${listing.fullplot}\nIMDB Rating:${listing.imdb.rating}\nYear: ${listing.year}\n}`
    );
  }

  async componentWillMount() {
    const response = await axios.get(`http://localhost:5000/listings`);
    const json = await response.data;
    this.setState({ data: json });
  }

  render() {
    const likeButtonLabel = this.state.liked ? '❤' : 'Like';

    return (
      <div className="app">
        <div>
          <h1>MovieRater</h1>
          <Router>
        <Routes>
          <Route exact path="/" component={App} />
          <Route path="/" component={App}/>
        </Routes>
      </Router>
          <div className="card-container">
            {this.state.data.map((listing) => (
              <TinderCard
                className="swipe"
                key={listing.name}
                onSwipe={(dir) => this.onSwipe(dir, listing._id)}
              >
                <div
                  style={{
                    backgroundImage: 'url(' + listing.poster + ')',
                  }}
                  className="card"
                >
                  <div className="card-details">
                    <h3>{listing.name}</h3>
                    <div className="card-actions">
                      <button
                        className="button"
                        onClick={() => this.handleClick(listing._id)}
                      >
                        {likeButtonLabel}
                      </button>
                      <button
                        className="button"
                        onClick={() => this.showDetails(listing)}
                      >
                        See Details
                      </button>
                      <button
                        className="button"
                        onClick={() => this.handleClick2(listing._id)}
                      >
                        Modify Submission
                      </button>
                    </div>

                    <element  id='form'>
                    <div>
                    <form >
                      <label>
                      <input type="text" name="name" />
                      </label>
                      <input type="submit" value="Submit" />
                    </form>
                    </div>
                    </element>
                 
                  </div>
                </div>
              </TinderCard>
            ))}
          </div>
        </div>
        <h2>Swipe left for drop or right to save...</h2>
      </div>
    );
  }
}

export default App;
