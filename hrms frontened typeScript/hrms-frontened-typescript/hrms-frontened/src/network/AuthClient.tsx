import axios from "axios";
import Swal from "sweetalert2";

const authClient = axios.create({
    baseURL: 'http://localhost:8000/',
});

authClient.interceptors.request.use(
    (config) => {
        // config.headers["Authorization"] = `Bearer ${localStorage.getItem("access_token")}`
        return config;
    },
    (error) => Promise.reject(error)
);

authClient.interceptors.response.use(
    (response) => response,
    (error) => {
   
        if (error.response) {
           
            switch (error.response.status) {
                case 400:
                    Swal.fire("Oops!", "This Page is Not Working Right Now");
                    break;
                case 401:
                    Swal.fire("Oops!", "Unauthorized Login Detected.");
                    break;
                case 500:
                    Swal.fire("Oops!", "Internal Server Error.");
                    break;
                default:
                    Swal.fire("Oops!", "Something Went Wrong.");                
            }
        } else {            
            Swal.fire("Oops!", "Network Error: Unable to reach the server.");
        }        
        return Promise.reject(error);
    }    
);

export default authClient;