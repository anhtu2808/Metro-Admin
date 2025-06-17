import React from 'react';
import { Col, Form, Row, Select, Input } from "antd";
import { FaSearch, FaPlus } from "react-icons/fa";
import TicketTable from "../TicketTable";
import PrimaryButton from "../../../components/PrimaryButton/PrimaryButton";

const { Option } = Select;

const FixPriceTab = () => {
  return (
    <div className="users-content" style={{ marginTop: "20px" }}>
      <Row justify="space-between" align="middle" gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Form layout="inline" name="lineSelectForm">
            <Form.Item label="Tuyến đường" name="line" style={{ flex: 1 }}>
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
            </Form.Item>
          </Form>
        </Col>

        <Col xs={24} md={10}>
          <Form layout="inline" name="searchForm">
            <Form.Item name="query" style={{ flex: 1 }}>
              <Input
                placeholder="Tìm kiếm theo tên ga hoặc giá"
                allowClear
              />
            </Form.Item>
            <Form.Item>
              <PrimaryButton 
                htmlType="submit" 
                icon={<FaSearch />}
                size="medium"
              >
                Tìm kiếm
              </PrimaryButton>
            </Form.Item>
          </Form>
        </Col>

        <Col xs={24} md={6} style={{ textAlign: "left" }}>
          <PrimaryButton
            icon={<FaPlus />}
            size="medium"
          >
            Thêm giá vé
          </PrimaryButton>
        </Col>
      </Row>

      <div className="table-user" style={{ marginTop: "24px" }}>
        <TicketTable />
      </div>
    </div>
  );
};

export default FixPriceTab;