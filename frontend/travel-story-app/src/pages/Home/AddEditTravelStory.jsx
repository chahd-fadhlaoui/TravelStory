import moment from "moment";
import React, { useState } from "react";
import { MdAdd, MdClose, MdUpdate } from "react-icons/md";
import { toast } from "react-toastify";
import DateSelector from "../../components/input/DateSelector";
import ImageSelector from "../../components/input/ImageSelector";
import TagInput from "../../components/input/TagInput";
import axiosInstance from "../../utils/axiosInstance";
import uploadImage from "../../utils/uploadImage";
const AddEditTravelStory = ({
  storyInfo,
  type,
  onClose,
  getAllTravelStories,
}) => {
  const [title, setTitle] = useState(storyInfo?.title || "");
  const [storyImg, setStoryImg] = useState(storyInfo?.imageUrl || "");
  const [story, setStory] = useState(storyInfo?.story || "");
  const [visitedLocation, setVisitedLocation] = useState(
    storyInfo?.visitedLocation || []
  );
  const [visitedDate, setVisitedDate] = useState(storyInfo?.visitedDate || "");

  const [error, setError] = useState("");
  //add new travel story
  const addNewTravelStory = async () => {
    try {
      let imageUrl = "";
      //upload image if present
      if (storyImg) {
        const imgUploadRes = await uploadImage(storyImg);
        //get the img url
        imageUrl = imgUploadRes.imageUrl || "";
      }
      const response = await axiosInstance.post("/add-travel-story", {
        title,
        story,
        visitedLocation,
        imageUrl: imageUrl || "",
        visitedDate: visitedDate
          ? moment(visitedDate).valueOf()
          : moment().valueOf(),
      });
      if (response.data && response.data.story) {
        toast.success("Story added successfully");
        //refresh stories
        getAllTravelStories();
        //close modal
        onClose();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message); //set error message
      } else {
        //handle unexpected error
        setError("Something went wrong.Please try again.");
      }
      console.log(error);
    }
  };

  //update travel story
  const updateTravelStory = async () => {
    const storyId = storyInfo._id;

    try {
      let imageUrl = "";

      let postData = {
        title,
        story,
        visitedLocation,
        imageUrl: storyInfo.imageUrl || "",
        visitedDate: visitedDate
          ? moment(visitedDate).valueOf()
          : moment().valueOf(),
      };

      if (typeof storyId === "object") {
        // upload new image
        const imgUploadRes = await uploadImage(storyImg);
        //get the img url
        imageUrl = imgUploadRes.imageUrl || "";
        postData = {
          ...postData,
          imageUrl: imageUrl,
        };
      }

      const response = await axiosInstance.put(
        "/edit-story/" + storyId,
        postData
      );

      if (response.data && response.data.story) {
        toast.success("Story Updated successfully");
        //refresh stories
        getAllTravelStories();
        //close modal
        onClose();
      }
    } catch (error) {
        console.log(error);
        
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message); //set error message
      } else {
        //handle unexpected error
        setError("Something went wrong.Please try again.");
      }
    }
  };

  const handleAddOrUpdateClick = () => {
    console.log("Input Data:", {
      title,
      storyImg,
      story,
      visitedLocation,
      visitedDate,
    });

    if (!title) {
      setError("Please enter a title");
      return;
    }
    if (!story) {
      setError("Please enter the story");
      return;
    }

    setError("");

    if (type === "edit") {
      updateTravelStory();
    } else {
      addNewTravelStory();
    }
  };

  //delete story img and update the story
  const handleDeleteStoryImg = async () => {
    // deleting the image
    const deleteImgRes = await axiosInstance.delete("/delete-image", {
      params: {
        imageUrl: storyInfo.imageUrl,
      },
    });

    if (deleteImgRes.data) {
      const storyId = storyInfo._id;

      let postData = {
        title,
        story,
        visitedLocation,
        visitedDate: moment().valueOf(),
        imageUrl: "",
      };
      // updating story
      const response = await axiosInstance.put(
        "/edit-story/" + storyId,
        postData
      );
      setStoryImg(null);
    }
  };
  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        <h5 className="text-lg font-medium text-slate-700">
          {type === "add" ? "Add Story" : "Edit Story"}
        </h5>

        <div>
          <div className="flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg">
            {type === "add" ? (
              <button className="btn-small" onClick={handleAddOrUpdateClick}>
                <MdAdd className="text-lg" />
                ADD STORY
              </button>
            ) : (
              <>
                <button className="btn-small" onClick={handleAddOrUpdateClick}>
                  <MdUpdate className="text-lg" /> UPDATE STORY
                </button>
              </>
            )}

            <button className="" onClick={onClose}>
              <MdClose className="text-xl text-slate-400" />
            </button>
          </div>

          {error && (
            <p className="text-xs text-red-500 pt-2 text-right">{error}</p>
          )}
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-2 pt-4">
        <label className="input-label">TITLE</label>
        <input
          type="text"
          className="text-2xl text-slate-950 outline-none"
          placeholder="A Day at Carthage"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />

        <div className="my-3">
          <DateSelector date={visitedDate} setDate={setVisitedDate} />
        </div>

        <ImageSelector
          image={storyImg}
          setImage={setStoryImg}
          handleDeleteImg={handleDeleteStoryImg}
        />

        <div className="flex flex-col gap-2 mt-4">
          <label className="input-label">STORY</label>
          <textarea
            className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
            placeholder="Your story"
            rows={10}
            value={story}
            onChange={({ target }) => setStory(target.value)}
          />
        </div>
        <div className="pt-3">
          <label className="input-label">VISITED LOCATION</label>
          <TagInput tags={visitedLocation} setTags={setVisitedLocation} />
        </div>
      </div>
    </div>
  );
};

export default AddEditTravelStory;
