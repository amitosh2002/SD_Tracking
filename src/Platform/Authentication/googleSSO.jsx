import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
  REQUIRES_REGISTRATION, 
  VERIFIED_USER_AND_LOGIN 
} from "../../Redux/Constants/AuthConstants";

export default function GoogleAuthButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;

      // Send Google token to backend
      const res = await axios.post(
        "http://localhost:8000/api/auth/sso/google-login",
        { token }
      );
      

      const { success, token: jwtToken, user } = res.data;

      if (!success) {
        console.log("Google login failed");
        return;
      }

      // Save JWT token
      localStorage.setItem("token", jwtToken);

      // Update Redux state
      dispatch({
        type: VERIFIED_USER_AND_LOGIN,
        payload: user,
      });

      dispatch({
        type: REQUIRES_REGISTRATION,
        payload: false,
      });

      // Navigate to home (no reload)
      navigate("/");

    } catch (err) {
      console.error("Google Login error:", err);
    }
  };

  return (
    <div style={{ marginBottom: "20px", display: "flex", justifyContent: "center" }}>
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => console.log("Google Login Failed")}
          ux_mode="popup"      // <-- IMPORTANT

      />
    </div>
  );
}
