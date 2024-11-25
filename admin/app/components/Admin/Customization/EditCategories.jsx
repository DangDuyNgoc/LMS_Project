import React, { useEffect, useState } from "react";
import Loader from "../../Loader/Loader";
import { styles } from "@/app/styles/style";
import { AiOutlineDelete } from "react-icons/ai";
import { IoMdAddCircleOutline } from "react-icons/io";
import { toast } from "react-hot-toast";
import {
  useGetHeroDataQuery,
  useUpdateLayoutMutation,
  useDeleteCategoryMutation,
} from "@/redux/features/layout/layoutApi";

const EditCategories = () => {
  const [categories, setCategories] = useState([]);
  const { data, isLoading, refetch } = useGetHeroDataQuery("Categories", {
    refetchOnMountOrArgChange: true,
  });

  const [deleteCategory] = useDeleteCategoryMutation();

  const [updateLayout, { isSuccess, error }] = useUpdateLayoutMutation();

  useEffect(() => {
    if (data) {
      setCategories(data.layout.categories);
    }
  }, [data]);

  console.log("data in categories layout: ", data);

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success("Categories Updated Successfully");
    }
    if (error) {
      toast.error(error.data?.message || "Something went wrong~");
    }
  }, [isSuccess, error, refetch]);

  const handleCategoryCreate = (id, value) => {
    setCategories((preCate) => 
      preCate.map((i) => (i._id === id ? { ...i, title: value } : i))
    );
  };

  const handleDeleteCategory = async (id) => {
    await deleteCategory(id);
    setCategories((prevCategory) =>
      prevCategory.filter((category) => category._id !== id)
    );
    toast.success("Deleted Category Successfully");
  };

  const newCategoriesHandler = () => {
    if (categories.length === 0 || categories[categories.length - 1].title === "") {
      toast.error("Category title cannot be empty!");
    } else {
      setCategories((preCate) => [...preCate, { title: "" }]);
    }
  };

  const areCategoriesUnchanged = (originalCategories, newCategories) => {
    return JSON.stringify(originalCategories) === JSON.stringify(newCategories);
  };

  const isAnyCategoryTitleEmpty = (categories) => {
    console.log("categories :", categories);
    return categories.some((cate) => cate.title === "");
  };

  const editCategoriesHandler = async () => {
    try {
      if (
        !areCategoriesUnchanged(data.layout.categories, categories) &&
        !isAnyCategoryTitleEmpty(categories)
      ) {
        await updateLayout({
          type: "Categories",
          categories,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update categories");
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="mt-[120px] text-center">
          <h1 className={`${styles.title}`}>All Categories</h1>
          {categories &&
            categories.map((item, index) => {
              return (
                <div key={index} className="p-3">
                  <div className="flex items-center w-full justify-center">
                    <input
                      className={`${styles.input} !w-[unset] border-2 !text-[20px]`}
                      value={item.title}
                      onChange={(e) =>
                        handleCategoryCreate(item._id, e.target.value)
                      }
                      placeholder="Enter category title"
                    />
                    <AiOutlineDelete
                      className="dark:text-white text-black text-[18px] cursor-pointer"
                      onClick={() => handleDeleteCategory(item._id)}
                    />
                  </div>
                </div>
              );
            })}
          <br />
          <br />
          <div className="w-full flex justify-center">
            <IoMdAddCircleOutline
              className="dark:text-white text-black text-[25px] cursor-pointer"
              onClick={newCategoriesHandler}
            />
          </div>
          <div
            className={`${
              styles.button
            } !w-[100px] !min-h-[40px] !h-[40px] dark:text-white text-black bg-[#cccccc34] 
              ${
                areCategoriesUnchanged(data.layout.categories, categories) ||
                isAnyCategoryTitleEmpty(categories)
                  ? "!cursor-not-allowed"
                  : "!cursor-pointer !bg-[#42d383]"
              }
              !rounded absolute bottom-12 right-12`}
            onClick={
              areCategoriesUnchanged(data.layout.categories, categories) ||
              isAnyCategoryTitleEmpty(categories)
                ? () => null
                : editCategoriesHandler
            }
          >
            Save
          </div>
        </div>
      )}
    </>
  );
};

export default EditCategories;
