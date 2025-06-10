import { Col, Divider, Row, Select } from "antd";
import { Option } from "antd/es/mentions";
import "./TicketPrice.css";
import { FaTicketAlt } from "react-icons/fa";
import TicketTable from "./TicketTable";
const TicketPrice = () => {
  return (
    <div className="price-container">
      <div className="price-title">
        <FaTicketAlt />
        Ticket Price
      </div>
      <div className="price-content">
        <div className="price-dropdown">
          <Row gutter={8}>
            <span className="price-label">Line</span>
            <Col flex="auto">
              <Select
                defaultValue="M1 Suối Tiên - Bến Thành"
                style={{ width: "100%" }}
              >
                <Option value="M1 Suối Tiên - Bến Thành">
                  M1 Suối Tiên - Bến Thành
                </Option>
                <Option value="M2 Bến Thành - Thủ Thiêm">
                  M2 Bến Thành - Thủ Thiêm
                </Option>
                <Option value="M3 Thủ Đức - Bình Thạnh">
                  M3 Thủ Đức - Bình Thạnh
                </Option>
              </Select>
            </Col>
          </Row>
        </div>
        <Divider></Divider>
        <div className="price-table">
          <TicketTable />
        </div>
      </div>
    </div>
  );
};

export default TicketPrice;
