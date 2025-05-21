    import { set, ref, onValue, remove } from "firebase/database";

    import axiosClient from "./Firebase";
    const SCHEMA = "user";
    class UserService {
      getAll() {
        const url = `${SCHEMA}.json`;
        return axiosClient.get(url);
        }
        getbyday(date) {
            const url = `${SCHEMA}/${date}.json`;
            return axiosClient.get(url);
          }
    update(data) {
          console.log(data)
        const url = `/${SCHEMA}/${data.username}.json`;
        return axiosClient.patch(url, data);
      }
      delete(data) {
      
      const url = `/${SCHEMA}/${data.username}.json`;
      return axiosClient.delete(url, data);
    
    }
 
}

export default new UserService();