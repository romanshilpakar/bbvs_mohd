import { useState } from "react";
import { useNavigate } from "react-router";
import { Formik } from "formik";
import { RouteProps } from "react-router";
import LoginLayout from "../layouts/Login";
import * as Yup from "yup";
import axios from "../axios";

const schema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
});

const ForgotPassword = (props: RouteProps): JSX.Element => {
  const navigate = useNavigate();
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<any>("");

  return (
    <div>
      <LoginLayout error={error} success={success}>
        <div className="form-container">
          <Formik
            initialValues={{
              email: ""
            }}
            validationSchema={schema}
            onSubmit={(values) => {
              axios
                .post("/auth/forgotpassword", { ...values })
                .then((res) => {
                  setError("");
                  setSuccess("Password reset link has been sent to your email.");
                })
                .catch((err) => {
                  let error = err.message;
                  if (err?.response?.data)
                    error = JSON.stringify(err.response.data);
                  setError(error);

                });
            }}
          >
            {({ errors, touched, getFieldProps, handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <div className="input-container">
                  <input
                    id="email"
                    type="email"
                    placeholder="Email"
                    {...getFieldProps("email")}
                  />
                  <div className="form-error-text">
                    {touched.email && errors.email ? errors.email : null}
                  </div>
                </div>
                <button className="login-button button-primary" type="submit">
                  Reset Password
                </button>
              </form>
            )}
          </Formik>

          <div 
            onClick={() => navigate("/login")}
          className="form-info-text" 
          style={{ cursor: "pointer" }}
          >
          Login to your Account ?
          </div>

          <hr />
        </div>
      </LoginLayout>
    </div>
  );
};

export default ForgotPassword;
