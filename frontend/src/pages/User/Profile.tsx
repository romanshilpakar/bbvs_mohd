import React, { useContext, useEffect, useRef, useState } from "react";
import { RouteProps } from "react-router";
import { AuthContext } from "../../contexts/Auth";
import axios from "../../axios";

type User = {
  id: number;
  name: string;
  citizenshipNumber: string;
  email: string;
  verified: boolean;
  profileImage:string;

};

interface UserData {
  email: string;
}


const Profile = (props: RouteProps) => {
  const authContext = useContext(AuthContext);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentUser, setCurrentUser] = useState<User>();
  const [imageData, setImageData] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // console.log("selectedFile:",selectedFile)

 


  useEffect(() => {
    const userData: UserData = { email: authContext.email };
    axios
      .get("/users/currentuser",{ params: userData })
      .then((res) => {
        setCurrentUser(res.data)
      })
      .catch((error) => console.log({ error }));
  }, []);


  const handleFileButtonClick = () => {
    // Trigger the click event on the hidden file input
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const reader = new FileReader();
  
      reader.onloadend = () => {
        const base64Data = `data:${file.type};base64,${reader.result?.toString().split(",")[1]}`;
        // Now 'base64Data' contains the image data as a base64 string
        setSelectedFile(file);
        setImageData(base64Data || "");

        handleFileUpload();
      };
  
      // Read the selected file as a data URL
      reader.readAsDataURL(file);

    }
  };
  

  const handleFileUpload = async () => {
    console.log("Profile...")
    if (!selectedFile) {
      console.error("No file selected");
      return;
    }
  
      try {
        const response = await axios.post("/users/profilepicture", {
          email:authContext.email,
          profileImage:imageData,
        });
        if(response.data){
        console.log("response:",response.data);
        window.location.reload();
        }
      } catch (error) {
        console.error("Error updating profile picture:", error);
      }
  
  };

  const handleLogout = async ()=>{
    await authContext.logout();
    window.location.reload();
  }


  return (
    <div className="profile-wrapper">
      <div className="left-panel">
        <span className="title-small">Profile</span>
        <div className="person-icon">
        {currentUser?.profileImage ?
            <img src={currentUser?.profileImage} alt="profile image"  height={100} width={100}
            style={{ borderRadius: '50%', objectFit: 'cover'}}/>

          :(
          <i className="bi bi-person-circle"></i>

          )}
        </div>

        <button onClick={handleFileButtonClick} className="button-primary">
          Select Image
        </button>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={(el) => (fileInputRef.current = el)}
          style={{ display: 'none' }} // Hide the file input
        />
       
            <button onClick={handleFileUpload} className="button-primary">
            {currentUser?.profileImage ? (
            "Change Profile Picture"
            )
         
            :(
              "Add Profie Picture"
            )}
            </button>

        <div className="text-normal username">Name: {authContext.name}</div>
        <p>Citizenship Number : {authContext.citizenshipNumber}</p>
        <p>Email : {authContext.email}</p>
        <button onClick={handleLogout} className="button-primary">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;