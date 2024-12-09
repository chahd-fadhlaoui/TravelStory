import React, { useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TravelStoryCard from "../../components/cards/TravelStoryCard";
import Navbar from "../../components/Navbar";
import axiosInstance from "../../utils/axiosInstance";
import AddEditTravelStory from "./AddEditTravelStory";
import ViewTravelStory from "./ViewTravelStory";
const Home = () => {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);
  const [allStories, setAllStories] = useState([]);

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [openViewModal, setOpenViewModal] = useState({
    isShown: false,
    data: null,
  });

  //get user info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        // set user info if data exists
        setUserInfo(response.data.user);
      }
    } catch (error) {
      console.log(error);
      if (error.response.status === 401) {
        // clear storage if unauthorized
        localStorage.clear();
        navigate("/login"); // Redirect to login
      }
    }
  };

  //Get all travel stories
  const getAllTravelStories = async () => {
    try {
      const response = await axiosInstance.get("/get-all-stories");
      if (response.data && response.data.stories) {
        // set user info if data exists
        setAllStories(response.data.stories);
      }
    } catch (error) {
      console.log("An unexpected error occurred , Please try again:", error);
      if (error.response.status === 401) {
        // clear storage if unauthorized
        localStorage.clear();
        navigate("/login"); // Redirect to login
      }
    }
  };

  // handle edit story click
  const handleEdit = (data) => {};

  //handle Travel story click
  const handleViewStory = (data) => {
    setOpenViewModal({ isShown: true, data });
  };

  //handle update Favourite
  const updateIsFavourite = async (storyData) => {
    const storyId = storyData._id;

    try {
      const response = await axiosInstance.put(
        "/update-is-favourite/" + storyId,
        {
          isFavourite: !storyData.isFavourite,
        }
      );
      if (response.data && response.data.message) {
        toast.success("Story updated successfully");
        getAllTravelStories();
      }
    } catch (error) {
      console.log("An unexpected error occurred , Please try again:", error);
    }
  };

  useEffect(() => {
    getAllTravelStories();
    getUserInfo();

    return () => {};
  }, []);

  return (
    <>
      <Navbar userInfo={userInfo} />

      <div className="container mx-auto py-10">
        <div className="flex gap-7">
          <div className="flex-1">
            {allStories.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {allStories.map((item) => {
                  return (
                    <TravelStoryCard
                      key={item._id}
                      imgUrl={item.imageUrl}
                      title={item.title}
                      story={item.story}
                      date={item.visitedDate}
                      visitedLocation={item.visitedLocation}
                      isFavourite={item.isFavourite}
                      onClick={() => handleViewStory(item)}
                      onFavouriteClick={() => updateIsFavourite(item)}
                    />
                  );
                })}
              </div>
            ) : (
              <>Empty Card here</>
            )}
          </div>

          <div className="w-[320px]"></div>
        </div>
      </div>

      {/* add && edit travel story model */}
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            zIndex: 999,
          },
        }}
        appElement={document.getElementById("root")}
        className="modal-box"
      >
        <AddEditTravelStory
          type={openAddEditModal.type}
          storyInfo={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null });
          }}
          getAllTravelStories={getAllTravelStories}
        />
      </Modal>

      {/* view travel story*/}
      <Modal
        isOpen={openViewModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            zIndex: 999,
          },
        }}
        appElement={document.getElementById("root")}
        className="modal-box"
      >
        <ViewTravelStory
          type={openViewModal.type}
          storyInfo={openViewModal.data || null}
        />
      </Modal>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-full bg-primary hover:bg-cyan-400 fixed right-10 bottom-10"
        onClick={() => {
          setOpenAddEditModal({
            isShown: true,
            type: "add",
            story: null,
          });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>
      <ToastContainer />
    </>
  );
};

export default Home;
