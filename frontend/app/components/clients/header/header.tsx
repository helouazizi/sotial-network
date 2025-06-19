"use client";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter()
  return (
    <header className="site-header">
      <div className="header-content">
        <h1 className="logo">Social-Network</h1>
        <nav className="nav-links">
          <button onClick={()=>{router.push("/")}}>Home</button>
          <button onClick={()=>{router.push("/addPost")}}>Add Post</button>
        </nav>
      </div>
    </header>
  );
}
