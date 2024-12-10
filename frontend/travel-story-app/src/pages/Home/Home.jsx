import moment from "moment";
import React, { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import { MdAdd } from "react-icons/md";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EmptyImg from "../../assets/images/placeholder.png";
import EmptyCard from "../../components/cards/EmptyCard";
import FilterInfoTitle from "../../components/cards/FilterInfoTitle";
import TravelStoryCard from "../../components/cards/TravelStoryCard";
import Navbar from "../../components/Navbar";
import axiosInstance from "../../utils/axiosInstance";
import { getEmptyCardMessage } from "../../utils/helper";
import AddEditTravelStory from "./AddEditTravelStory";
import ViewTravelStory from "./ViewTravelStory";
const Home = () => {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);
  const [allStories, setAllStories] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setfilterType] = useState("");

  const [dateRange, setdateRange] = useState({ form: null, to: null });

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
  const handleEdit = (data) => {
    setOpenAddEditModal({
      isShown: true,
      type: "edit",
      data: data,
    });
  };

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
        if (filterType === "search") {
          onSearchStory(searchQuery);
        } else if (filterType === "date") {
          filterStoriesByDate(dateRange);
        } else {
          getAllTravelStories();
        }
      }
    } catch (error) {
      console.log("An unexpected error occurred , Please try again:", error);
    }
  };

  // Delete story
  const deleteTravelStory = async (data) => {
    const storyId = data._id;

    try {
      const response = await axiosInstance.delete("/delete-story/" + storyId);
      if (response.data && !response.data.error) {
        toast.success("Story deleted successfully");
        setOpenViewModal((prevState) => ({
          ...prevState,
          isShown: false,
        }));
        //refresh stories
        getAllTravelStories();
      }
    } catch (error) {
      console.log("Something went wrong.Please try again.");
    }
  };

  // handle search story
  const onSearchStory = async (query) => {
    try {
      const response = await axiosInstance.get("/search", {
        params: {
          query,
        },
      });

      if (response.data && response.data.stories) {
        setfilterType("search");
        setAllStories(response.data.stories);
      }
    } catch (error) {
      console.log("Error is search;", error.message);
      console.log("Something went wrong.Please try again.");
    }
  };

  //clear seach
  const handleClearSearch = () => {
    setfilterType("");
    getAllTravelStories();
  };

  // handle data range select
  const handleDayClick = (day) => {
    setdateRange(day);
    filterStoriesByDate(day);
  };

  // handle filter story by date range
  const filterStoriesByDate = async (day) => {
    try {
      const startDate = day.from ? moment(day.from).valueOf() : null;
      const endDate = day.to ? moment(day.to).valueOf() : null;

      if (startDate && endDate) {
        const response = await axiosInstance.get("/travel-stories/filter", {
          params: {
            startDate,
            endDate,
          },
        });
        if (response.data && response.data.stories) {
          setfilterType("date");
          setAllStories(response.data.stories);
        }
      }
    } catch (error) {
      console.log("Something went wrong in filter.Please try again.");
    }
  };

  const resetFilter = () => {
    setdateRange({ from: null, to: null });
    setfilterType("");
    getAllTravelStories();
  };

  useEffect(() => {
    getAllTravelStories();
    getUserInfo();

    return () => {};
  }, []);

  return (
    <>
      <Navbar
        userInfo={userInfo}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchNote={onSearchStory}
        handleClearSearch={handleClearSearch}
      />

      <div className="container mx-auto py-10">
        <FilterInfoTitle
          filterType={filterType}
          filterDates={dateRange}
          onClear={() => {
            resetFilter();
          }}
        />

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
              <EmptyCard
                imgSrc={EmptyImg}
                message={getEmptyCardMessage(filterType)}
              />
            )}
          </div>

          <div className="w-[350px]">
            <div className="bg-white border border-slate-200 shadow-lg shadow-slate-200/60 rounded-lg">
              <div className="p-3">
                <DayPicker
                  captionLayout="dropdown-buttons"
                  mode="range"
                  selected={dateRange}
                  onSelect={handleDayClick}
                  pagedNavigation
                />
              </div>
            </div>
          </div>
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
          storyInfo={openViewModal.data || null}
          className="modal-box"
          onClose={() => {
            setOpenViewModal((prevState) => ({
              ...prevState,
              isShown: false,
            }));
          }}
          onEditClick={() => {
            setOpenViewModal((prevState) => ({
              ...prevState,
              isShown: false,
            }));
            handleEdit(openViewModal.data || null);
          }}
          onDeleteClick={() => {
            deleteTravelStory(openViewModal.data || null);
          }}
        />
      </Modal>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-full bg-primary hover:bg-cyan-400 fixed right-10 bottom-10"
        onClick={() => {
          setOpenAddEditModal({
            isShown: true,
            type: "add",
            data: null,
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
