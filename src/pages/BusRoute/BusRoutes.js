import { Button, Col, Divider, Form, Input, Row } from "antd";
import "./BusRoutes.css";
import TableBus from "./TableBus";
import { useState } from "react";
import ModalAddBus from "./ModalAddBus";
import { FaTrainSubway } from "react-icons/fa6";
const BusRoutes = () => {
  const [showModalAddBus, setShowModalAddBus] = useState(false);

  return (
    <div className="bus-container">
      <div className="bus-title">
        <FaTrainSubway />
        Bus Routes
      </div>
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
        <ModalAddBus
          isModalOpen={showModalAddBus}
          setIsModalOpen={setShowModalAddBus}
        />
      </div>
    </div>
  );
};

export default BusRoutes;
