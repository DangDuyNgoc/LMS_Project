import React, { useEffect, useState } from "react";
import { HiMinus, HiPlus } from "react-icons/hi";

import {
  useGetHeroDataQuery,
  useUpdateLayoutMutation,
  useDeleteFaqMutation
} from "@/redux/features/layout/layoutApi";
import { styles } from "@/app/styles/style";
import { AiOutlineDelete } from "react-icons/ai";
import { IoMdAddCircleOutline } from "react-icons/io";
import { toast } from "react-hot-toast";
import Loader from "./../../Loader/Loader";

const EditFaq = () => {
  const [questions, setQuestions] = useState([]);
  const { data, isLoading } = useGetHeroDataQuery("FAQ", {
    refetchOnMountOrArgChange: true,
  });

  const [deleteFaq, {isSuccess: deleteFaqSuccess, error: deleteFaqError}] = useDeleteFaqMutation();

  const [updateLayout, { isSuccess, error }] = useUpdateLayoutMutation();

  useEffect(() => {
    if (isSuccess) {
      toast.success("FAQ Updated Successfully");
    }
    if (error) {
      toast.error(error.data?.message || "Something went wrong~");
    }
  }, [isSuccess, error]);

    useEffect(() => {
    if (deleteFaqSuccess) {
      toast.success("FAQ Deleted Successfully");
    }
    if (deleteFaqError) {
      toast.error(deleteFaqError.data?.message || "Something went wrong~");
    }
  }, [deleteFaqError, deleteFaqSuccess]);

  useEffect(() => {
    if (data) {
      setQuestions(data.layout.faq);
    }
  }, [data]);

  console.log("data in faq: ", data);

  const toggleQuestion = (id) => {
    setQuestions((preQuestion) => 
      preQuestion.map((q) => (q._id === id ? { ...q, active: !q.active } : q))
    );
  };

  const handleQuestionChange = (id, value) => {
    setQuestions((preQuestion) => 
      preQuestion.map((q) => (q._id === id ? { ...q, question: value } : q))
    );
  };

  const handleAnswerChange = (id, value) => {
    setQuestions((preQuestion) => 
      preQuestion.map((q) => (q._id === id ? { ...q, answer: value } : q))
    );
  };

  const newFaqHandler = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        answer: "",
      },
    ]);
  };

  // check if the FAQ arrays are unchanged
  const areQuestionsUnchanged = (originalQuestion, newQuestion) => {
    return JSON.stringify(originalQuestion) === JSON.stringify(newQuestion);
  };

  const isAnyQuestionEmpty = (question) => {
    return question.some((q) => q.question === "" || q.answer === "");
  };

  const handleDeleteFaq = async (id) => {
    await deleteFaq(id);
    setQuestions((preQuestion) =>
      preQuestion.filter((q) => q._id !== id)
    );  
  }

  const handleEdit = async () => {
    if (
      !areQuestionsUnchanged(data.layout.faq, questions) &&
      !isAnyQuestionEmpty(questions)
    ) {
      await updateLayout({
        type: "FAQ",
        faq: questions,
      });
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-[90%] 800px:w-[80%] m-auto mt-[120px]">
          <div className="mt-12">
            <dl className="space-y-8">
              {questions.map((item) => (
                <div
                  key={item.id}
                  className={`${
                    item._id !== questions[0]._id && "border-t"
                  } border-gray-200 pt-6`}
                >
                  <dt className="text-lg">
                    <button
                      className="flex items-start dark:text-white text-black justify-between w-full text-left focus:outline-none"
                      onClick={() => toggleQuestion(item._id)}
                    >
                      <input
                        className={`${styles.input} border-2`}
                        value={item.question}
                        placeholder="Add your question....."
                        onChange={(e) =>
                          handleQuestionChange(item._id, e.target.value)
                        }
                      />

                      <span className="ml-6 flex-shrink-0">
                        {item.active ? (
                          <HiMinus className="h-6 w-6"></HiMinus>
                        ) : (
                          <HiPlus className="h-6 w-6" />
                        )}
                      </span>
                    </button>
                  </dt>

                  {item.active && (
                    <dd className="mt-2 pr-12">
                      <input
                        className={`${styles.input} border-2`}
                        value={item.answer}
                        placeholder="Add your answer...."
                        onChange={(e) =>
                          handleAnswerChange(item._id, e.target.value)
                        }
                      />
                      <span className="ml-6 flex-shrink-0">
                        <AiOutlineDelete
                          className="dark:text-white text-black text-[18px] cursor-pointer"
                          onClick={() =>handleDeleteFaq(item._id)}
                        />
                      </span>
                    </dd>
                  )}
                </div>
              ))}
            </dl>
            <br />
            <br />
            <IoMdAddCircleOutline
              className="dark:text-white text-black text-[25px] cursor-pointer"
              onClick={newFaqHandler}
            />
          </div>

          <div
            className={`${
              styles.button
            } !w-[100px] !min-h-[40px] !h-[40px] dark:text-white text-black bg-[#cccccc34] 
                ${
                  areQuestionsUnchanged(data.layout.faq, questions) ||
                  isAnyQuestionEmpty(questions)
                    ? "!cursor-not-allowed"
                    : "!cursor-pointer !bg-[#42d383]"
                }
                !rounded fixed bottom-12 right-12`}
            onClick={
              areQuestionsUnchanged(data.layout.faq, questions) ||
              isAnyQuestionEmpty(questions)
                ? () => null
                : handleEdit
            }
          >
            Save
          </div>
        </div>
      )}
    </>
  );
};

export default EditFaq;
