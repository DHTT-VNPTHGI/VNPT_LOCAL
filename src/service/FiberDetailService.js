    import axiosClient from "./Main";
    const SCHEMA = "fiberdetail";
    class FiberDetailService {
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
        const url = `/${SCHEMA}/${data.id}.json`;
        return axiosClient.patch(url, data);
      }
      delete(data) {
      
      const url = `/${SCHEMA}/${data.id}.json`;
      return axiosClient.delete(url, data);
    
    }
   
}

export default new FiberDetailService();