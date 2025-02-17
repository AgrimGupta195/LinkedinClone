import { Routes ,Route, Navigate } from "react-router-dom"
import SignUpPage from "./pages/auth/SignUpPage"
import LoginPage from "./pages/auth/LoginPage"
import HomePage from "./pages/HomePage"
import Layout from "./components/layout/auth/Layout/Layout"
import { Toaster } from "react-hot-toast"
import { useAuthStore } from "./store/useStore"
import { useEffect } from "react"
import { Loader } from "lucide-react"
function App() {
  const{checkAuth,authUser,isCheckingAuth}=useAuthStore();
    useEffect(()=>{
        checkAuth();
    },[checkAuth]);
    if(isCheckingAuth && !authUser) return(
        <div className="flex items-center justify-center h-screen">
            <Loader className="size-10 animate-spin"/>
        </div>
    )
  return (
    <Layout>
			<Routes>
      <Route path="/" element={authUser?<HomePage/>:<Navigate to="/login"/>}/>
            <Route path="/signup" element={!authUser?<SignUpPage/>:<Navigate to="/"/>}/>
            <Route path="/login" element={!authUser?<LoginPage/>:<Navigate to="/"/>}/>
				{/* <Route path='/notifications' element={authUser ? <NotificationsPage /> : <Navigate to={"/login"} />} />
				<Route path='/network' element={authUser ? <NetworkPage /> : <Navigate to={"/login"} />} />
				<Route path='/post/:postId' element={authUser ? <PostPage /> : <Navigate to={"/login"} />} />
				<Route path='/profile/:username' element={authUser ? <ProfilePage /> : <Navigate to={"/login"} />} /> */}
			</Routes>
			<Toaster />
		</Layout>
  )
}

export default App
