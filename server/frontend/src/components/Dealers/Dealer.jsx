import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Dealers.css';
import '../assets/style.css';
import positive_icon from '../assets/positive.png';
import neutral_icon from '../assets/neutral.png';
import negative_icon from '../assets/negative.png';
import review_icon from '../assets/reviewbutton.png';
import Header from '../Header/Header';

const Dealer = () => {
  const [dealer, setDealer] = useState({});
  const [reviews, setReviews] = useState([]);
  const [unreviewed, setUnreviewed] = useState(false);
  const [postReview, setPostReview] = useState(<></>);

  const params = useParams();
  const id = params.id;
  const root_url = `${window.location.origin}/`;
  const dealer_url = `${root_url}djangoapp/dealer/${id}`;
  const reviews_url = `${root_url}djangoapp/reviews/dealer/${id}`;
  const post_review = `${root_url}postreview/${id}`;

  const get_dealer = useCallback(async () => {
    const res = await fetch(dealer_url, {
      method: 'GET',
    });
    const retobj = await res.json();

    if (retobj.status === 200) {
      const dealerobjs = Array.from(retobj.dealer);
      setDealer(dealerobjs[0]);
    }
  }, [dealer_url]);

  const get_reviews = useCallback(async () => {
    const res = await fetch(reviews_url, {
      method: 'GET',
    });
    const retobj = await res.json();

    if (retobj.status === 200) {
      if (retobj.reviews.length > 0) {
        setReviews(retobj.reviews);
      } else {
        setUnreviewed(true);
      }
    }
  }, [reviews_url]);

  const senti_icon = (sentiment) => {
    const icon = sentiment === 'positive' ? positive_icon : sentiment === 'negative' ? negative_icon : neutral_icon;
    return icon;
  };

  useEffect(() => {
    get_dealer();
    get_reviews();
    if (sessionStorage.getItem('username')) {
      setPostReview(
        <a href={post_review}>
          <img src={review_icon} style={{ width: '110px' }} alt='Post Review' />
        </a>,
      );
    }
  }, [get_dealer, get_reviews, post_review]);

  return (
    <div className='page-shell'>
      <Header />
      <div className='dealer-header'>
        <h1 className='dealer-title'>
          {dealer.full_name}
          {postReview}
        </h1>
        <h4 className='dealer-subtitle'>
          {dealer.city},{dealer.address}, Zip - {dealer.zip}, {dealer.state}
        </h4>
        <a className='search-link' href={`/searchcars/${id}`}>
          Search Cars
        </a>
      </div>
      <div className='reviews_panel'>
        {reviews.length === 0 && unreviewed === false ? (
          <span>Loading Reviews....</span>
        ) : unreviewed === true ? (
          <div>No reviews yet!</div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className='review_panel'>
              <img src={senti_icon(review.sentiment)} className='emotion_icon' alt='Sentiment' />
              <div className='review'>{review.review}</div>
              <div className='reviewer'>
                {review.name} {review.car_make} {review.car_model} {review.car_year}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dealer;
