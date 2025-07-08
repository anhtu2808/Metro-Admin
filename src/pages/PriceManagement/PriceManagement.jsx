import { Tabs } from "antd";
import "./PriceManagement.css";
import { FaTicketAlt } from "react-icons/fa";
import FixPriceTab from "./FixPriceTab/FixPriceTab";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLayoutData } from "../../redux/layoutSlice";
import DynamicPriceTableTab from "./DynamicPriceTableTab/DynamicPriceTableTab";
import DynamicPriceMasterTab from "./DynamicPriceMasterTab/DynamicPriceMasterTab";

const PriceManagement = () => {
  const dispatch = useDispatch();
  // Set title và icon cho trang
  useEffect(() => {
    dispatch(
      setLayoutData({
        title: "Giá vé",
        icon: <FaTicketAlt />,
      })
    );
  }, [dispatch]);

  // Tab items configuration
  const tabItems = [
    {
      key: '1',
      label: 'Vé cố định',
      children: <FixPriceTab />,
    },
    {
      key: '2',
      label: 'Quy định giá vé lượt',
      children: <DynamicPriceMasterTab />,
    },
    {
      key: '3',
      label: 'Bảng giá vé lượt',
      children: <DynamicPriceTableTab />,
    },
  ];

  return (
    <div className="manage-ticket-container">

      <Tabs 
        defaultActiveKey="1" 
        items={tabItems}
        style={{ marginTop: "20px" }}
      />
    </div>
  );
};

export default PriceManagement;
