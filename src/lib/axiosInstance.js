import axios from "axios";
export default axios.create({
  baseURL: "https://identitytoolkit.googleapis.com/v1/",
  params: {
    key: "AIzaSyBK7Eh9lLVn1f_Y_HuGSa1W2U6Mi2lqF8g",
  },
});
