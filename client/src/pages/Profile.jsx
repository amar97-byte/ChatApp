import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";

const Profile = () => {

const {authUser , updateProfile} = useContext(AuthContext)

  const [selectedImage, setSelectedImage] = useState(null);
  const [name, setName] = useState(authUser.fullName);
  const [bio, setBio] = useState(authUser.bio);

  const navigate = useNavigate();

  const handleSubmit = async (e)=> {
    e.preventDefault()
    if(!selectedImage){
      await updateProfile({fullName : name , bio})
    navigate('/')
      return
    }
    // to convert the selected profile image in 64bit before uploading 
    const render = new FileReader()
    render.readAsDataURL(selectedImage)
    render.onload = async()=> {
      const base64Image = render.result
      console.log(base64Image);
      
      await updateProfile({profilePic : base64Image ,fullName : name , bio })
    navigate('/')

    }
  }

  return (
    <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center">
      <div
        className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex 
      items-center justify-between max-sm:flex-col-reverse rounded-lg"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-10 flex-1">
          <h3 className="text-lg">Profile details</h3>
          <label
            htmlFor="avtar"
            className="flex items-center gap-3 cursor-pointer"
          >
            <input
              onChange={(e) => setSelectedImage(e.target.files[0])}
              type="file"
              id="avtar"
              accept=".png , .jpg , .jpeg"
              hidden
            />
            <img
              src={
                selectedImage
                  ? URL.createObjectURL(selectedImage)
                  : assets.avatar_icon
              }
              alt=""
              className={`w-12 h-12 ${selectedImage && "rounded-full"}`}
            />
            upload profile image
          </label>

          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            required
            placeholder="Your Name"
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 "
          />

          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            placeholder="Write profile bio"
            required
            rows={4}
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
          ></textarea>

          <button
            type="submit"
            className="bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 
          rounded-full text-lg cursor-pointer"
          >
            Save
          </button>
        </form>
        <img className={`max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10 
          ${selectedImage && 'rounded-full'}`} src={ authUser?.profilePic || assets.logo_icon} alt="" />
      </div>
    </div>
  );
};

export default Profile;
