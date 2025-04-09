import React, { useContext, useEffect, useState } from 'react'
import { Context } from "../../main"
import { Navigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from 'axios'
import { IoIosHeartDislike } from "react-icons/io";
import { FaHeart, FaFlag } from "react-icons/fa";

const SingleBlog = () => {
  const { mode, isAuthenticated, user } = useContext(Context)
  const { id } = useParams();
  const [blog, setBlog] = useState({});
  const [likes,setLikes]=useState(0);
  const [reported,setReported]=useState(false);

  useEffect(() => {
    const getSingleBlog = async () => {
      try {
        console.log(id)
        const { data } = await axios.get(`http://localhost:4000/user/blog/${id}`, {
          withCredentials: true
        })
        console.log(data);
        setBlog({
          authorAvatar: data.blog.authorId.avatar.url,
          ...data.blog
        }
        );
      } catch (err) {
        // toast.error(err.message);
        setBlog({})
      }
    }
    getSingleBlog()
  }, []);

  if (!isAuthenticated) {
    toast.error("You Are Not Authenticated Please Login");
    return <Navigate to={'/'}></Navigate>
  }
  const likeBlog=async()=>{
    try{
      const {data}=await axios.post(`http://localhost:4000/user/blog/like/${id}`,{},{
        withCredentials:true
      })
      console.log(data);
      setLikes((prev)=> prev+1);
    }catch(err){
      console.log(err);
      toast.error("Failed to like")
    }
  }
  const disLikeBlog=async()=>{
    try{
      const {data}=await axios.post(`http://localhost:4000/user/blog/dislike/${id}`,{},{
        withCredentials:true
      })
      console.log(data);
      setLikes((prev) => Math.max(0, prev - 1));
    }catch(err){
      console.log(err);
      toast.error("Failed to dislike")
    }
  }
  const reportBlog=async()=>{
    try {
      const { data } = await axios.post(`http://localhost:4000/user/blog/report/${id}`, {}, { withCredentials: true });
      console.log(data);
      toast.success("Blog Reported");
      setReported(true);
    } catch (err) {
      console.log(err);
      toast.error("Failed to Report");
    }
  }
  return (
    <article className={mode === "dark" ? "dark-bg singleBlog" : "light-bg singleBlog"}>
      {blog && (
        <section className='container'>
          <div className="category">{blog.category}</div>
          <h1>{blog.title1}</h1>
          <div className="writer_section">
            <div className="author">
              <img src={blog.authorAvatar} alt="" />
              <p>{blog.authorName}</p>
            </div>
          </div>
          {
            blog && blog.photo1 && (
              <img src={blog.photo1.url} alt="mainImage" />
            )
          }
          <p className='intro-text'>{blog.title1}</p>
          <p>{blog.desc1}</p>
          <div className="sub-para">
            <h3>{blog.title2}</h3>
            {
              blog && blog.photo2 && (
                <img src={blog.photo2.url} alt="paraImage" />
              )
            }
            <p>{blog.desc2}</p>

          </div>
          <div>
            <h5>likes: <span>{blog.likes}</span></h5>
          </div>
          <div  style={{ display: "flex", alignItems: "center", gap: "15px", marginTop: "20px" }}>
            <button  onClick={likeBlog} style={{ border:"none", display: "flex", alignItems: "center", gap: "5px" }} className={mode ==="dark" ? "dark-bg" : "light-bg"}>
              <FaHeart color="red" /> {likes}
            </button>
            <button onClick={disLikeBlog} style={{ color:"red", border:"none", display: "flex", alignItems: "center", gap: "5px" }} className={mode ==="dark" ? "dark-bg" : "light-bg"}>
            <IoIosHeartDislike />
            </button>
            <button
              onClick={reportBlog}
              className={mode ==="dark" ? "dark-bg" : "light-bg"}
              style={{border:"none", display: "flex", alignItems: "center", gap: "5px", color: reported ? "gray" : "black" }}
              disabled={reported}
            >
              <FaFlag color="orange" /> {reported ? "Reported" : "Report"}
              (If You Have Any Issue Regarding This Post Then You Can Report)
            </button>
          </div>
        </section>
      )}
    </article>
  )
}

export default SingleBlog