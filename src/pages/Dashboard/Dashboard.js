import { Card, Divider } from "antd";
import "./Dashboard.css";
import { MdOutlineAnalytics } from "react-icons/md";
import "./BarChart";
import Barchart from "./BarChart";

const stats = [
  { label: "Number of clients" },
  { label: "Number of tickets" },
  { label: "Revenue" },
];

const Dashboard = () => (
  <div className="dashboard-container">
    <div className="dashboard-header">
      <MdOutlineAnalytics />
      Dashboard
    </div>
    <Divider />
    <Card className="dashboard-stats-card" styles={{ body: { padding: 0 } }}>
      <table className="dashboard-stats-table">
        <tbody>
          {stats.map((item, idx) => (
            <tr key={item.label}>
              <td className="dashboard-stats-label">{item.label}</td>
              <td className="dashboard-stats-value">200</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
    <Divider />
    <Barchart />
  </div>
);

export default Dashboard;
