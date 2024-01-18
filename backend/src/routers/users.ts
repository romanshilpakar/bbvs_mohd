import { Router } from "express";
import multer from "multer";
// import notVerifiedController from "../controllers/users/not-verified";
import allUserController from "../controllers/users/allusers";
import currentUserController from "../controllers/users/currentuser"
import allCandidatesController from "../controllers/users/allcandidates";
import verifiedCandidatesController from "../controllers/users/verifiedcandidates";
import verifyController from "../controllers/users/verify";
import notVerifyuserController from "../controllers/users/notverifyuser";
import deleteController from "../controllers/users/delete";
import viewdocumentController from "../controllers/users/viewdocument";
import profilepictureController from "../controllers/users/profilepicture"

const router = Router();

// router.get("/all", notVerifiedController);
router.get("/allusers", allUserController);
router.get("/currentuser", currentUserController);
router.get("/allcandidates", allCandidatesController);
router.get("/verifiedcandidates", verifiedCandidatesController);
router.post("/verify", verifyController);
router.post("/profilepicture", profilepictureController);
router.post("/notverify", notVerifyuserController);
router.post("/viewdocument", viewdocumentController);
router.delete("/delete", deleteController);

export default router;
