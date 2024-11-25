"use client";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { styles } from "../../styles/style";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .required("Please enter your email!"),
  password: Yup.string().required("Please enter your password!"),
});

const Login = ({ setRoute }) => {
  const [show, setShow] = useState(false);
  const [login, { isSuccess, error }] = useLoginMutation();

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: schema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        await login(values);
      } catch (error) {
        console.log(error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const onSubmitHandler = (e) => {
    e.preventDefault();
    formik.handleSubmit();
  }

  useEffect(() => {
    if (isSuccess) {
      toast.success("Login Successfully");
      redirect("/admin");
    }
    if (error) {
      if ("data" in error) {
        const errorData = error;
        console.log("error", errorData.data?.message)
        toast.error(errorData.data?.message);
      }
    }
  }, [error, isSuccess]);

  const { errors, touched, values, handleChange } = formik;
  return (
    <div className="w-full">
      <h1 className={`${styles.title}`}>Login with Learning</h1>
      <form onSubmit={onSubmitHandler}>
        <label className={`${styles.label}`} htmlFor="email">
          Enter your email
        </label>
        <input
          name="email"
          id="email"
          type="text"
          value={values.email}
          onChange={handleChange}
          placeholder="your email"
          className={`${errors.email && touched.email && "border-red-500"} ${
            styles.input
          }`}
        />
        {errors.email && touched.email && (
          <span className="text-red-500 pt-2-block">{errors.email}</span>
        )}

        <div className="w-full mt-5 relative mb-1">
          <label className={`${styles.label}`} htmlFor="email">
            Enter your password
          </label>
          <input
            type={!show ? "password" : "text"}
            value={values.password}
            onChange={handleChange}
            id="password"
            name="password"
            placeholder="Your password"
            className={`${
              errors.password && touched.password && "border-red-500"
            } ${styles.input}`}
          />

          {!show ? (
            <AiOutlineEyeInvisible
              className="absolute bottom-3 right-2 z-1 cursor-pointer"
              size={20}
              onClick={() => setShow(true)}
            />
          ) : (
            <AiOutlineEye
              className="absolute bottom-3 right-2 z-1 cursor-pointer"
              size={20}
              onClick={() => setShow(false)}
            />
          )}
          {errors.email && touched.email && (
            <span className="text-red-500 pt-2-block">{errors.password}</span>
          )}
        </div>

        <div className="w-full mt-5">
          <input type="submit" value="Login" className={`${styles.button}`} />
        </div>
        <br />
      </form>
      <br />
      <h5 className={`${styles.text}`}>
        Create a new account?{" "}
        <span
          className="text-blue-500 cursor-pointer"
          onClick={() => setRoute("Sign-up")}
        >
          Click Here
        </span>
      </h5>
    </div>
  );
};

export default Login;
