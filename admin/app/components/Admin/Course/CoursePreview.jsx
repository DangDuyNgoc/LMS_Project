import React from "react";
import CoursePlayer from "../../../utils/CoursePlayer";
import { styles } from "@/app/styles/style";
import Rating from "./../../../utils/Rating";

const CoursePreview = ({
  courseData,
  handleCreateCourse,
  active,
  setActive,
  isEdit,
}) => {
  const discountPercent =
    ((courseData?.estimatedPrice - courseData?.price) /
      courseData?.estimatedPrice) *
    100;

  const discount = discountPercent.toFixed(0);

  const prevButton = () => {
    setActive(active - 1);
  };

  const createCourse = () => {
    handleCreateCourse();
  };

  return (
    <div className="w-[90%] m-auto py-5 mb-5">
      <div className="w-full relative">
        <div className="w-full mt-10">
          <CoursePlayer
            videoUrl={courseData?.demoUrl}
            title={courseData?.title}
          />
        </div>

        <div className="flex items-center">
          <h1 className="pt-5 text-[25px] dark:text-white text-black">
            {courseData?.price === 0 ? "Free" : courseData?.price + "$"}
          </h1>
          <h5 className="pl-3 text-[20px] mt-2 line-through opacity-80 dark:text-white text-black">
            {courseData?.estimatedPrice}$
          </h5>
          <h5 className="pl-5 pt-4 text-[22px] dark:text-white text-black">
            {discount}% OFF
          </h5>
        </div>

        <div className="flex items-center">
          <div
            className={`${styles.button} !w-[180px] my-3 font-Poppins !bg-[crimson] cursor-not-allowed`}
          >
            Buy Now {courseData?.price}$
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="text"
            name=""
            id=""
            placeholder="Discount code....."
            className={`${styles.input} 1500px:!w-[50%] 1100px:w-[60%] ml-3 !mt-0`}
          />
          <div
            className={`${styles.button} !w-[120px] my-3 ml-4 font-Poppins cursor-pointer`}
          >
            Apply
          </div>
        </div>
        <p className="pb-1 dark:text-white text-black">
          • Source code included
        </p>
        <p className="pb-1 dark:text-white text-black">
          • Full lifetime access
        </p>
        <p className="pb-1 dark:text-white text-black">
          • Certificate of completion
        </p>
        <p className="pb-3 dark:text-white text-black 800px:pb-1">
          • Premium Support
        </p>
      </div>

      <div className="w-full">
        <div className="w-full 800px:pr-5">
          <h1 className="text-[25px] font-Poppins font-[600] dark:text-white text-black">
            {courseData?.name}
          </h1>
          <div className="flex items-center justify-between pt-3 dark:text-white text-black">
            <div className="flex items-center">
              <Rating rating={0} />
              <h5>0 Reviews</h5>
            </div>
            <h5>0 Students</h5>
          </div>
          <br />
        </div>
        {/* course description */}
        <div className="w-full">
          <h1 className="text-[25px] font-Poppins font-[600] dark:text-white text-black">
            Course Details
          </h1>
          <p className="text-[18px] mt-[20px] whitespace-pre-line w-full overflow-hidden dark:text-white text-black">
            {courseData?.description}
          </p>
        </div>
        <br />
        <br />
      </div>

      <div className="w-full flex items-center justify-between">
        <div
          className="w-full 800px:w-[180px] flex items-center justify-center h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-8 cursor-pointer"
          onClick={() => prevButton()}
        >
          Prev
        </div>

        <div
          className="w-full 800px:w-[180px] flex items-center justify-center h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-8 cursor-pointer"
          onClick={() => createCourse()}
        >
          {isEdit ? "Update Course" : "Create Course"}
        </div>
      </div>
    </div>
  );
};

export default CoursePreview;
