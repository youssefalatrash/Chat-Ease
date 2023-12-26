// Import necessary dependencies and styles
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { Buffer } from "buffer";
import loader from "../assets/loader.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { setAvatarRoute } from "../utils/APIRoutes";

// Main component for setting user avatars
export default function SetAvatar() {
  // API endpoint for fetching avatars
  const api = `https://api.multiavatar.com/4645646`;
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]); // Holds fetched avatar images
  const [isLoading, setIsLoading] = useState(true); // Indicates whether data is still loading
  const [selectedAvatar, setSelectedAvatar] = useState(undefined); // Stores the index of the selected avatar
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  // Check if the user is logged in; redirect to login if not
  useEffect(() => {
    const checkLocalStorage = async () => {
      if (!localStorage.getItem("test-users")) {
        navigate("/login");
      }
    };

    checkLocalStorage();
  }, []);

  // Set user's profile picture with the selected avatar
  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar", toastOptions);
    } else {
      const user = await JSON.parse(
        localStorage.getItem("test-users")
      );

      try {
        const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
          image: avatars[selectedAvatar],
        });

        if (data.isSet) {
          // Update user data and navigate to the home page on successful avatar set
          user.isAvatarImageSet = true;
          user.avatarImage = data.image;
          localStorage.setItem(
            "test-users",
            JSON.stringify(user)
          );
          navigate("/");
        } else {
          toast.error(
            "Error setting avatar. Please try again.",
            toastOptions
          );
        }
      } catch (error) {
        console.error("Error setting avatar:", error);
        toast.error("Error setting avatar. Please try again.", toastOptions);
      }
    }
  };

  // Fetch avatar images from the API
  useEffect(() => {
    const fetchData = async () => {
      const data = [];
      for (let i = 0; i < 4; i++) {
        try {
          const image = await axios.get(
            `${api}/${Math.round(Math.random() * 1000)}`
          );
          const buffer = Buffer.from(image.data);
          data.push(buffer.toString("base64"));
        } catch (error) {
          console.error("Error fetching image:", error);
          // Handle the error as needed
        }
      }
      setAvatars(data);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  // Select a random avatar from the fetched avatars
  const selectRandomAvatar = () => {
    const randomIndex = Math.floor(Math.random() * avatars.length);
    setSelectedAvatar(randomIndex);
  };

  return (
    <>
      {isLoading ? (
        // Display loader while data is loading
        <Container>
          <img src={loader} alt="loader" className="loader" />
        </Container>
      ) : (
        // Display avatar selection interface once data is loaded
        <Container>
          <div className="title-container">
            <h1>Pick an Avatar as your profile picture</h1>
          </div>
          <div className="avatars">
            {avatars.map((avatar, index) => {
              return (
                <div
                  className={`avatar ${
                    selectedAvatar === index ? "selected" : ""
                  }`}
                  key={index}
                >
                  <img
                    src={`data:image/svg+xml;base64,${avatar}`}
                    alt="avatar"
                    key={avatar}
                    onClick={() => setSelectedAvatar(index)}
                  />
                </div>
              );
            })}
          </div>
          <button onClick={setProfilePicture} className="submit-btn">
            Set as Profile Picture
          </button>
          <button onClick={selectRandomAvatar} className="random-btn">
            Select Random Avatar
          </button>
          <ToastContainer />
        </Container>
      )}
    </>
  );
}

// Styled component for the main container
const Container = styled.div`
  // Styles for the main container
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;

  .loader {
    max-inline-size: 100%;
  }

  // Styles for the title container
  .title-container {
    h1 {
      color: white;
    }
  }

  // Styles for the avatar container
  .avatars {
    display: flex;
    gap: 2rem;

    // Styles for individual avatars
    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;

      img {
        height: 6rem;
        transition: 0.5s ease-in-out;
      }
    }

    // Styles for the selected avatar
    .selected {
      border: 0.4rem solid #4e0eff;
    }
  }

  // Styles for the "Set as Profile Picture" button
  .submit-btn {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;

    &:hover {
      background-color: #4e0eff;
    }
  }

  // Styles for the "Select Random Avatar" button
  .random-btn {
    background-color: #6c5eff; // Use a brighter color for the random button
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    margin-top: 1rem;

    &:hover {
      background-color: #6c5eff;
    }
  }
`;
