import Link from "next/link";
import { useState, useEffect } from "react";
import eloRating from "elo-rating";
import axios from "axios"; // Import axios for API requests

export default function Vote() {
  const [eloOne, setEloOne] = useState(1000);
  const [eloTwo, setEloTwo] = useState(1000);
  const [imageOne, setImageOne] = useState({});
  const [imageTwo, setImageTwo] = useState({});

  // Fetch random images from backend
  const fetchRandomImages = async () => {
    try {
      const responseOne = await axios.get("/get_random_image");
      const responseTwo = await axios.get("/get_random_image");
      setImageOne(responseOne.data);
      setImageTwo(responseTwo.data);
      // Update ELOs if needed
      setEloOne(responseOne.data.votes || 1000);
      setEloTwo(responseTwo.data.votes || 1000);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  // Function to calculate ELO exchange and update backend
  const vote = async (winner) => {
    let result = eloRating.calculate(eloOne, eloTwo, winner === 1);
    setEloOne(result.playerRating);
    setEloTwo(result.opponentRating);

    // API call to update the ELO rating in the backend
    // You need to create this endpoint in your backend
    await axios.post("/update_image_elo", {
      imageIdOne: imageOne.id,
      newEloOne: result.playerRating,
      imageIdTwo: imageTwo.id,
      newEloTwo: result.opponentRating,
    });
  };

  // Load new images on each page load
  useEffect(() => {
    fetchRandomImages();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-700">
        Voting
      </h1>
      <div className="flex justify-center gap-10 mb-4">
        <div className="text-center">
          <img
            src={imageOne.url}
            alt="Image One"
            className="w-60 h-60 object-cover rounded-lg shadow-lg hover:shadow-2xl cursor-pointer"
            onClick={() => vote(1)}
          />
          <p className="mt-2 text-lg font-semibold">ELO: {eloOne}</p>
        </div>
        <div className="text-center">
          <img
            src={imageTwo.url}
            alt="Image Two"
            className="w-60 h-60 object-cover rounded-lg shadow-lg hover:shadow-2xl cursor-pointer"
            onClick={() => vote(2)}
          />
          <p className="mt-2 text-lg font-semibold">ELO: {eloTwo}</p>
        </div>
      </div>
    </div>
  );
}
