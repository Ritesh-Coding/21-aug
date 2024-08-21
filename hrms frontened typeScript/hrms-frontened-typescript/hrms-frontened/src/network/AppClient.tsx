import axios from "axios";
import Swal from "sweetalert2";

const appClient = axios.create({
    baseURL: 'http://localhost:8000/',
});

appClient.interceptors.request.use(
    (config)=>{
        config.headers["Authorization"]=`Bearer ${localStorage.getItem("access_token")}`
        return config
    },
    (error)=>Promise.reject(error)
)
appClient.interceptors.response.use(
    (response)=>response,
    (error)=>{
    
        if(error.response){
            switch(error.response.status){
                case 400:
                    // Swal.fire("Oops!", "This Page is Not Working Right Now")
                    break
                case 401:
                    Swal.fire("Oops!", "Unauthorized Login Detected.")
                    break
                case 500:
                    Swal.fire("Oops!", "Internal server Error.")
                    break
                default:
                    Swal.fire("Oops!", "Something Went Wrong.")                    
            }
        }  
        return Promise.reject(error);      
    }    
)
export default appClient