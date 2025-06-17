import { Button, Input } from "antd";
import "./BusRouteManagement.css";
import TableBus from "./TableBus";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLayoutData } from "../../redux/layoutSlice";
import { FaBus } from "react-icons/fa";
import ModalCreateBusRoute from "./ModalCreateBusRoute";
const BusRouteManagement = () => {
  const dispatch = useDispatch();
  const [showModalAddBus, setShowModalAddBus] = useState(false);

  // Set title và icon cho trang
  useEffect(() => {
    dispatch(
      setLayoutData({
        title: "Quản lý tuyến bus",
        icon: <FaBus />,
      })
    );
  }, [dispatch]);

  return (
    <div className="bus-container">
      <div className="bus-content">
        <div className="bus-routes-search">
          <Input placeholder="Search Line" className="bus-search-input" />
          <Input placeholder="Search Station" className="bus-search-input" />
          <Button type="primary" onClick={() => setShowModalAddBus(true)}>
            Add Bus
          </Button>
        </div>
        <div className="table-bus">
          <TableBus />
        </div>
        <ModalCreateBusRoute
          isModalOpen={showModalAddBus}
          setIsModalOpen={setShowModalAddBus}
        />
      </div>
    </div>
  );
};

export default BusRouteManagement;
