import  { useState } from "react";
import { useNavigate } from "react-router";
import { Formik } from "formik";
import LoginLayout from "../layouts/Login";
import * as Yup from "yup";
import axios from "../axios";

const schema = Yup.object().shape({
  name: Yup.string().min(3).required(),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(3).required("Required"),
  confirm: Yup.string()
    .oneOf([Yup.ref("password")], "must be same as password")
    .required(),
});

const CandidateSignup = (): JSX.Element => {
  const navigate = useNavigate();
  const [error, setError] = useState<any>("");
  const [success, setSuccess] = useState<string>("");
  const [docError, setDocError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);



  const handleFileChange = (event:any) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setDocError('');
    } else {
      setSelectedFile(null);
      setDocError('Please upload a PDF file.');
    }
  };

  return (
    <div>
      <LoginLayout error={error} success={success}>
        <div className="form-container">
        <h3>Candidate Signup</h3>

          <Formik
            initialValues={{
              name: "",
              email: "",          
              password: "",
              confirm: "",             
            }}
            validationSchema={schema}
            onSubmit={({ name, email, password}) => {
              if (selectedFile) {
                const formData = new FormData();
                formData.append('pdf', selectedFile);
                formData.append('name', name);
                formData.append('email', email);
                formData.append('password', password);
                axios
                .post('/auth/candidatesignup', formData, {
                  headers: {
                    'Content-Type': 'multipart/form-data',
                  },
                })
                .then((res) => {
                  setError("");
                  setSuccess("Signup Successful!");
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                })
                .catch((err) => {
                  let error: string = err.message;
                  if (err?.response?.data)
                    error = JSON.stringify(err.response.data);
                  setError(error.slice(0, 50));
                  setTimeout(() => {
                    window.location.reload();
                  }, 2000);
                });
              }
              
            }}
          >
            {({ errors, touched, getFieldProps, handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <div className="input-container">
                  <input
                    id="name"
                    type="text"
                    placeholder="Name"
                    {...getFieldProps("name")}
                  />
                  <div className="form-error-text">
                    {touched.name && errors.name ? errors.name : null}
                  </div>
                </div>

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

                <div className="input-container">
                  <input
                    id="password"
                    type="password"
                    placeholder="Password"
                    {...getFieldProps("password")}
                  />
                  <div className="form-error-text">
                    {touched.password && errors.password
                      ? errors.password
                      : null}
                  </div>
                </div>

                <div className="input-container">
                  <input
                    id="confirm"
                    type="password"
                    placeholder="Confirm Password"
                    {...getFieldProps("confirm")}
                  />
                  <div className="form-error-text">
                    {touched.confirm && errors.confirm ? errors.confirm : null}
                  </div>
                </div>

                
                <div className="input-container">
                <input
                    placeholder="Upload your document"
                    disabled
                  />
                 <input 
                    type="file"
                    name="pdf" 
                    placeholder="Upload your document"
                    accept="application/pdf" 
                    onChange={handleFileChange} />
                 {docError && <p className="error">{docError}</p>}

                </div>

                <button className="button-primary" type="submit">
                  Create a New Account
                </button>
              </form>
            )}
          </Formik>

          {/* <hr /> */}
          <div 
          onClick={() => navigate("/signup")}
          className="form-info-text"
          style={{ cursor: "pointer" }}     
          >Voter Signup?</div>

          <div className="form-info-text">Already have an account?</div>

          <button
            onClick={() => navigate("/login")}
            className="button-secondary"
            type="button"
          >
            Login
          </button>
        </div>
      </LoginLayout>
    </div>
  );
};

export default CandidateSignup;