import "./singlePage.scss";
import Slider from "../../components/slider/Slider";
import Map from "../../components/map/Map";
import { useNavigate, useLoaderData } from "react-router-dom";
import DOMPurify from "dompurify";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import useChatStore from "../../lib/useChatStore";

function SinglePage() {
  const setChatUsers = useChatStore((state) => state.setChatUsers);

  const post = useLoaderData();
  const [saved, setSaved] = useState(post.isSaved );

  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  console.log("Post isSaved:", post.isSaved);


  // Initialize state with post.isSaved
  useEffect(() => {
    console.log("Updated saved state:", saved);
  }, [saved]);
  
  // Ensure state updates when post changes
  useEffect(() => {
    setSaved(post.isSaved);
  }, [post.isSaved]);

  const handleSave = async () => {
    console.log(saved)
    if (!currentUser) {
       navigate("/login");
      return;
    }

    // Optimistic UI Update
    setSaved((prev) => !prev);
    console.log(saved)

    try {
      await apiRequest.post("/users/save", { postId: post.id });
    } catch (err) {
      console.error("Save error:", err);
      // Rollback state if request fails
      setSaved((prev) => !prev);
    }
  };


  const sendMessage = async () => {
    console.log(currentUser.id, currentUser.username);
    console.log(post.userId, post.user.username);

    const senderId = currentUser.id;
    const receiverId = post.userId;

    // Store sender & receiver in Zustand
    setChatUsers(senderId, currentUser.username, receiverId, post.user.username);

    console.log("Users set in Zustand:", senderId, receiverId);
    
    try {
      const chat = await apiRequest.post('/chats' , { receiverId });
      console.log(chat.data)

      const res = await apiRequest.post("/messages/" + chat.data.id, { text: "Hi I am Interesd in your property" });
      console.log(res.data)

      navigate("/profile")
    } catch (error) {
      console.log(error)
      
    }

  }
  

  return (
    <div className="singlePage">
      <div className="details">
        <div className="wrapper">
          <Slider images={post.images} />
          <div className="info">
            <div className="top">
              <div className="post">
                <h1>{post.title}</h1>
                <div className="address">
                  <img src="/pin.png" alt="Location Pin" />
                  <span>{post.address}</span>
                </div>
                <div className="price">$ {post.price}</div>
              </div>
              <div className="user">
                {post.user?.avatar && <img src={post.user.avatar} alt="User Avatar" />}
                <span>{post.user?.username}</span>
              </div>
            </div>
            <div
              className="bottom"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post.postDetail.desc),
              }}
            ></div>
          </div>
        </div>
      </div>

      <div className="features">
        <div className="wrapper">
          <p className="title">General</p>
          <div className="listVertical">
            <FeatureItem
              icon="/utility.png"
              title="Utilities"
              description={post.postDetail.utilities === "owner" ? "Owner is responsible" : "Tenant is responsible"}
            />
            <FeatureItem
              icon="/pet.png"
              title="Pet Policy"
              description={post.postDetail.pet === "allowed" ? "Pets Allowed" : "Pets not Allowed"}
            />
            <FeatureItem icon="/fee.png" title="Income Policy" description={post.postDetail.income} />
          </div>

          <p className="title">Sizes</p>
          <div className="sizes">
            <SizeItem icon="/size.png" description={`${post.postDetail.size} sqft`} />
            <SizeItem icon="/bed.png" description={`${post.bedroom} beds`} />
            <SizeItem icon="/bath.png" description={`${post.bathroom} bathroom`} />
          </div>

          <p className="title">Nearby Places</p>
          <div className="listHorizontal">
            <FeatureItem
              icon="/school.png"
              title="School"
              description={formatDistance(post.postDetail.school)}
            />
            <FeatureItem
              icon="/bus.png"
              title="Bus Stop"
              description={`${post.postDetail.bus}m away`}
            />
            <FeatureItem
              icon="/restaurant.png"
              title="Restaurant"
              description={`${post.postDetail.restaurant}m away`}
            />
          </div>

          <p className="title">Location</p>
          <div className="mapContainer">
            <Map items={[post]} />
          </div>

          <div className="buttons">
            <button onClick={sendMessage}>
              <img src="/chat.png" alt="Chat Icon" />
              Send a greeting Hi 👋
            </button>
            <button
              onClick={handleSave}
              style={{ backgroundColor: saved ? "#fece51" : "white" }}
            >
              <img src="/save.png" alt="Save Icon" />
              {saved ? "Place Saved" : "Save the Place"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// **Reusable Component for Feature Items**
const FeatureItem = ({ icon, title, description }) => (
  <div className="feature">
    <img src={icon} alt={title} />
    <div className="featureText">
      <span>{title}</span>
      <p>{description}</p>
    </div>
  </div>
);

// **Reusable Component for Size Items**
const SizeItem = ({ icon, description }) => (
  <div className="size">
    <img src={icon} alt="Size Icon" />
    <span>{description}</span>
  </div>
);

// **Distance Formatting Function**
const formatDistance = (distance) => {
  return distance > 999 ? (distance / 1000).toFixed(1) + " km away" : distance + " m away";
};

export default SinglePage;
