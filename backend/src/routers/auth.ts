import { Router } from "express";
import multer from "multer";
import loginController from "../controllers/auth/login";
import adminController from "../controllers/auth/addadmin";
import checkController from "../controllers/auth/check";
import logoutController from "../controllers/auth/logout";
import signupController from "../controllers/auth/signup";
import candidateSignupController from "../controllers/auth/candidatesignup";
import forgotPasswordController from "../controllers/auth/forgotpassword";
import resetPasswordController from "../controllers/auth/resetpassword";



const router = Router();

router.post("/login", loginController);
router.post("/addadmin", adminController);
router.post("/check", checkController);
router.post("/logout", logoutController);
router.post("/signup", signupController);
// router.post("/candidatesignup", candidateSignupController);
router.post("/forgotpassword", forgotPasswordController);
router.put("/resetpassword/:token", resetPasswordController);

// Configure multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/candidatesignup", upload.single("pdf"), candidateSignupController);




export default router;
