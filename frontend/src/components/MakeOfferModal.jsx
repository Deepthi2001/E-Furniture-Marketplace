import { useState } from "react";
import "../styles/Modal.css";
import Snackbar from '@mui/material/Snackbar';
import { APIEndPoints } from "../utils/config.js";

const MakeOfferModal = (props) => {
	const {onCloseModal, handleSubmitOffer } = props;
  const [offerPrice, setOfferPrice] = useState('');

  return (
    <div className="modal-overlay">
			<div className="modal">
				<button className="close-button" onClick={onCloseModal}>
					X
				</button>
        <h1>Please enter the price you'd like to offer.</h1>
        <input
          type="number"
          value={offerPrice}
          onChange={(e) => setOfferPrice(e.target.value)}
          placeholder="Enter your offer price"
          style={{ margin:'20px', padding:'10px' }}
        />
        <button onClick={() => handleSubmitOffer(offerPrice)}
          style={{ margin:'20px', padding:'5px' }}
          >Submit Offer</button>

      </div>
    </div>
  );
};

export default MakeOfferModal;
