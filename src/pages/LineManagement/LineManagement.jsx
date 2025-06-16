import "./LineManagement.css";
import {
  Card,
  Input,
  Button,
  List,
  Layout,
  Typography,
  Dropdown,
  Divider,
} from "antd";
import {
  PlusOutlined,
  EllipsisOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { FaTrain } from "react-icons/fa";

const { Content } = Layout;
const { Text } = Typography;

const dataLine = ["M1 Bến xe Suối Tiên - Bến Thành"];
const dataSegments = [
  "Bến xe Suối Tiên - Đại học Quốc Gia",
  "Đại Học Quốc Gia - Khu Công Nghệ Cao",
  "Khu Công Nghệ Cao - Thủ Đức",
  "Thủ Đức - Bình Thái",
];
const dataStations = [
  "Bến Xe Suối Tiên",
  "Đại Học Quốc Gia",
  "Khu Công Nghệ Cao",
  "Thủ Đức",
  "Bình Thái",
];

const menuItems = [
  { key: "EDIT", label: "Edit" },
  { key: "DELETE", label: "Delete" },
];
const ListCard = ({ title, data, onAdd, onMenuClick }) => (
  <>
    <Card
      title={
        <div className="card-title">
          <Text strong>{title}</Text>
          <Button onClick={onAdd} type="text" icon={<PlusOutlined />} />
        </div>
      }
      style={{ width: 300 }}
    >
      <Input
        placeholder="Search"
        prefix={<SearchOutlined />}
        className="input-search"
      />
      <List
        dataSource={data}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Dropdown
                menu={{
                  items: menuItems,
                  onClick: ({ key }) => onMenuClick?.(key, item),
                }}
                key="dropdown"
              >
                <EllipsisOutlined style={{ cursor: "pointer" }} />
              </Dropdown>,
            ]}
          >
            {item}
          </List.Item>
        )}
      />
    </Card>
  </>
);

const LineManagement = () => {
  const handleAddItem = () => {
    alert("me");
  };
  const handleMenuClick = (action, item) => {
    if (action === "EDIT") {
      alert("me");
    } else if (action === "DELETE") {
      alert(`me`);
    }
  };
  return (
    <div className="metro-layout">
      <div className="metro-title">
        <FaTrain />
        Metro Routes
      </div>
      <Divider></Divider>
      <div className="metro-content">
        <Layout>
          <Content>
            <ListCard
              title="Line"
              data={dataLine}
              onAdd={handleAddItem}
              onMenuClick={handleMenuClick}
            />
            <ListCard
              title="Line Segment"
              data={dataSegments}
              onAdd={handleAddItem}
              onMenuClick={handleMenuClick}
            />
            <ListCard
              title="Station"
              data={dataStations}
              onAdd={handleAddItem}
              onMenuClick={handleMenuClick}
            />
          </Content>
        </Layout>
      </div>
    </div>
  );
};

export default LineManagement;
