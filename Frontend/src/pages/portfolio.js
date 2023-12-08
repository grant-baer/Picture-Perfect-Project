import Link from "next/link";
import { isAuthenticated } from "./auth";
import Cookie from "js-cookie";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import axios from "axios";

export default function Portfolio() {
  const [portfolio, setPortfolio] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const modalRef = useRef(null);

  useEffect(() => {
    async function fetch_portfolio() {
      await axios
        .get("http://localhost:5000/fetch_portfolio", {
          headers: {
            Authorization: `Bearer ${Cookie.get("token")}`,
          },
        })
        .then((response) => {
          setPortfolio(response.data);
        })
        .catch((error) => console.error("Error: ", error));
    }
    fetch_portfolio();
  }, []);

  const openImageModal = (image) => {
    setSelectedImage(image);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const handleModalClick = (e) => {
    // Check if the click event occurred outside the image modal
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      closeImageModal();
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {portfolio &&
            portfolio.map((image) => (
              <div
                key={image.id}
                className="transition-transform transform hover:scale-105"
                onClick={() => openImageModal(image)}
              >
                <div className="w-full h-full relative rounded-lg">
                  <Image
                    className="rounded-lg"
                    src={image.url}
                    alt="Votable Image"
                    width={1024}
                    height={1024}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>

      {selectedImage && (
        <div
          className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-80"
          onClick={handleModalClick}
        >
          <div className="bg-white rounded-lg" ref={modalRef}>
            <button
              className="bg-white absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={closeImageModal}
            ></button>
            <Image
              src={selectedImage.url}
              alt="Votable Image"
              width={500}
              height={500}
            />
            <p className="m-4">&quot;{selectedImage.prompt}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;
  const token = req.cookies["token"];

  if (!(await isAuthenticated(token))) {
    // If the user is not authenticated, redirect them to the login page
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  // If the user is authenticated, render the Portfolio page
  return {
    props: {}, // Will be passed to the page component as props
  };
}
