import { useState } from "react";
import { useNavigate } from "react-router";
import { Formik } from "formik";
import { RouteProps } from "react-router";
import LoginLayout from "../layouts/Login";
import * as Yup from "yup";
import axios from "../axios";
import { useParams } from "react-router-dom";

const schema = Yup.object().shape({
  password: Yup.string().min(3).required("Required"),
  confirm: Yup.string()
    .oneOf([Yup.ref("password")], "must be same as password")
    .required(),
});

const ResetPassword = (props: RouteProps): JSX.Element => {
  const navigate = useNavigate();
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<any>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { token } = useParams();

  return (
    <div>
      <LoginLayout error={error} success={success}>
        <div className="form-container">
          <Formik
            initialValues={{
              password: "",
              confirm: "",
            }}
            validationSchema={schema}
            onSubmit={(values, { setSubmitting }) => {
              setLoading(true);
              setSubmitting(true);
              axios
                .put(`/auth/resetpassword/${token}`, { ...values })
                .then((res) => {
                  setError("");
                  setSuccess("Password Reset Successful");
                  setTimeout(() => {
                    window.location.reload();
                  }, 2000);
                })
                .catch((err) => {
                  let error = err.message;
                  if (err?.response?.data) error = JSON.stringify(err.response.data);
                  setError(error);
                  setTimeout(() => {
                    window.location.reload();
                  }, 2000);
                })
                .finally(() => {
                  setLoading(false);
                  setSubmitting(false);
                });
            }}
          >
            {({ errors, touched, getFieldProps, handleSubmit, isSubmitting }) => (
              <form onSubmit={handleSubmit}>
                <div className="input-container">
                  <input
                    id="password"
                    type="password"
                    placeholder="New Password"
                    {...getFieldProps("password")}
                  />
                  <div className="form-error-text">
                    {touched.password && errors.password ? errors.password : null}
                  </div>
                </div>

                <div className="input-container">
                  <input
                    id="confirm"
                    type="password"
                    placeholder="Confirm New Password"
                    {...getFieldProps("confirm")}
                  />
                  <div className="form-error-text">
                    {touched.confirm && errors.confirm ? errors.confirm : null}
                  </div>
                </div>

                <button
                  className="login-button button-primary"
                  type="submit"
                  disabled={isSubmitting || loading}
                >
                  {loading ? "Resetting..." : "Reset Password"}
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

export default ResetPassword;
