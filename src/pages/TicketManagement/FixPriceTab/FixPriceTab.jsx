import React, { useEffect, useState } from 'react';
import { Col, Form, Row, Select, Input, message } from "antd";
import { FaSearch, FaPlus } from "react-icons/fa";
import PrimaryButton from "../../../components/PrimaryButton/PrimaryButton";
import { createTicketTypeAPI, deleteTicketTypeAPI, getAllTicketTypesAPI, updateTicketTypeAPI } from '../../../apis';
import TicketTypeModal from './TicketTypeModal/TicketTypeModal';
import TicketTypeTable from './TicketTypeTable';


const { Option } = Select;

const FixPriceTab = () => {
  const [ticketTypes, setTicketTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredTicketTypes, setFilteredTicketTypes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTicketType, setEditingTicketType] = useState(null);

  useEffect(() => {
    const fetchTicketTypes = async () => {
      setLoading(true);
      try {
        const res = await getAllTicketTypesAPI();
        console.log('API Response:', res); // Debug log
        setTicketTypes(res.result.data);
        setFilteredTicketTypes(res.result.data); // Set filtered data initially
      } catch (error) {
        message.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTicketTypes();
  }, []);

  // Filter data when search changes
  useEffect(() => {
    if (search.trim() === "") {
      setFilteredTicketTypes(ticketTypes.filter(ticketType => ticketType.isStatic === true));
    } else {
      const filtered = ticketTypes.filter(ticketType =>
        ticketType.name.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredTicketTypes(filtered.filter(ticketType => ticketType.isStatic === true));
    }
  }, [search, ticketTypes]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };
  const handleDelete = async (record) => {
    try {
      const res = await deleteTicketTypeAPI(record.id);
      if (res.code === 204  ) {
        message.success('Xóa vé thành công');
        setTicketTypes(prev => prev.filter(ticket => ticket.id !== record.id));
        setFilteredTicketTypes(prev => prev.filter(ticket => ticket.id !== record.id));
      } else {
        message.error('Xóa vé thất bại');
      }
    } catch (error) {
      message.error(error.message);
    }
  }

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is already handled by useEffect above
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTicketType(null);
  }
  const handleSubmitModal = async (data) => {
    try {
      setLoading(true);
      if (data.id) {
        const res = await updateTicketTypeAPI(data.id, data);
        if (res.code === 200) {
          message.success('Cập nhật vé thành công');
          setTicketTypes(prev => prev.map(ticket => ticket.id === data.id ? data : ticket));
          closeModal();
        } else {
          message.error('Cập nhật vé thất bại');
        }
      } else {
        const res = await createTicketTypeAPI(data);
        if (res.code === 201) {
          message.success('Thêm vé thành công');
          setTicketTypes(prev => [...prev, data]);
          setFilteredTicketTypes(prev => [...prev, data]);
          closeModal();
        } else {
          message.error('Thêm vé thất bại');
        }
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
   
  }
  const handleOpenModal = (data) => {
    setIsModalOpen(true);
    setEditingTicketType(data);
  }

  return (
    <div className="users-content" style={{ marginTop: "20px" }}>
      <Row justify="space-between" align="middle" gutter={[16, 16]}>
        <Col xs={24} md={10}>
          <Form layout="inline" name="searchForm" onFinish={handleSearch}>
            <Form.Item name="query" style={{ flex: 1 }}>
              <Input
                placeholder="Tìm kiếm theo tên vé"
                allowClear
                value={search}
                onChange={handleSearchChange}
              />
            </Form.Item>
            <Form.Item>
              <PrimaryButton
                onClick={handleSearch}
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
            onClick={() => handleOpenModal(null)}
          >
            Thêm giá vé
          </PrimaryButton>
        </Col>
      </Row>

      <div className="table-user" style={{ marginTop: "24px" }}>
        <TicketTypeTable 
        ticketData={filteredTicketTypes} 
        loading={loading} 
        handleOpenModal={handleOpenModal} 
        handleDelete={handleDelete}
        />
      </div>
      <TicketTypeModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSubmit={handleSubmitModal}
        editingData={editingTicketType} // null nếu tạo mới
      />

    </div>

  );
};

export default FixPriceTab;