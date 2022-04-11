import { getStorage } from "firebase/storage";
import firebaseApp from "./firebase-config";

const storage = getStorage(firebaseApp);

export default storage;
