import { Tabs } from "antd";
import "./TicketManagement.css";
import { FaTicketAlt } from "react-icons/fa";
import FixPriceTab from "./FixPriceTab/FixPriceTab";
import DynamicPriceTab from "./DynamicPriceTab/DynamicPriceTab";
import TripPriceTableTab from "./DynamicPriceTab/DynamicPriceTab";

const TicketManagement = () => {
  // Tab items configuration
  const tabItems = [
    {
      key: '1',
      label: 'Vé không giới hạn',
      children: <FixPriceTab />,
    },
    {
      key: '2',
      label: 'Giá vé lượt',
      children: <DynamicPriceTab />,
    },
    {
      key: '3',
      label: 'Bảng giá vé lượt',
      children: <TripPriceTableTab />,
    },
  ];

  return (
    <div className="manage-ticket-container">
      <div className="ticket-title">
        <FaTicketAlt style={{ marginRight: "8px" }} />
        Giá vé
      </div>

      <Tabs 
        defaultActiveKey="1" 
        items={tabItems}
        style={{ marginTop: "20px" }}
      />
    </div>
  );
};

export default TicketManagement;
