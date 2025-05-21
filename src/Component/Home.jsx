import React, { useEffect, useState } from "react";
import vnptImage from "../Assets/img/TOA NHA VNPT HGI_SKYCAM.jpg"; // Đảm bảo bạn đã có hình ảnh trong thư mục assets
import UserService from "../Service/UserService";
import { toast } from "react-toastify";
import Header from "../Layout/Header";

function Home() {
    const [list, SetList] = useState([])
    useEffect  (() => {
        UserService.getAll().then(res => {
            console.log(res.data)
            SetList(Object.values(res.data))
            toast.success("Thành công")
        })
        let user = { username: "tamle", passowrd: "1234" }
        UserService.update(user).then(
            res => {
                console.log(res.data)
            }
        )
},[])
  return (
    <div className="home">
      <Header />
      {/* Header */}

      {/* Banner */}
      <section className="banner">
        <img
          src={vnptImage}
          alt="Viễn Thông Hậu Giang"
          className="banner-img"
        />
        {/* <div className="banner-text">
          <h2>Chào mừng bạn đến </h2>
          <h2> Viễn Thông Hậu Giang</h2>
          <p>Uy tín, chất lượng và đổi mới</p>
        </div> */}
          </section>
          <div className="container mt-5">
      <h1 className="text-center mb-4">Chào mừng bạn đến với Bootstrap</h1>
      <button className="btn btn-primary">Nhấn vào tôi</button>
    </div>
          {
              list && list.map((item, index) => {
                  return (
                      <>
                          <section>
                              {item.username}
                      </section>
                      </>
                  )
              })
          }

      {/* About Section */}
      <section id="about" className="section about">
        <h2 className="section-title">Về chúng tôi</h2>
        <p className="section-content">
          Viễn Thông Hậu Giang là đơn vị hàng đầu trong lĩnh vực viễn thông, cam
          kết mang lại những dịch vụ chất lượng cao với sứ mệnh kết nối và đổi
          mới cho cộng đồng.
        </p>
      </section>
      <footer className="footer">
        <div className="footer-content">
          <p>
            Bản quyền &copy; 2024 Trung tâm ĐHTT - Viễn Thông Hậu Giang. All
            rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
