import { Form, Input, InputNumber, Modal, Checkbox } from 'antd'
import React, { useEffect } from 'react'

const TicketTypeModal = ({ open, onCancel, onSubmit, editingData }) => {
  const [form] = Form.useForm()

  useEffect(() => {
    if (open) {
      if (editingData) {
        console.log('Setting form with editingData:', editingData); // Debug log
        // Ensure all fields are properly mapped
        form.setFieldsValue({
          name: editingData.name || '',
          description: editingData.description || '',
          price: editingData.price || 0,
          validityDays: editingData.validityDays || 0,
          isStudent: editingData.isStudent || false
        })
      } else {
        console.log('Resetting form for new ticket'); // Debug log
        form.resetFields()
      }
    }
  }, [editingData, form, open])

  const handleOk = () => {
    form.validateFields().then(values => {
      console.log('Form values:', values); // Debug log
      const finalData = {
        ...editingData,
        ...values,
        isStatic: true // luôn gửi true
      }
      console.log('Final data to submit:', finalData); // Debug log
      onSubmit(finalData)
      form.resetFields()
    }).catch(errorInfo => {
      console.log('Validation failed:', errorInfo);
    })
  }

  const handleCancel = () => {
    form.resetFields()
    onCancel()
  }

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
      destroyOnClose={true}
      title={editingData ? 'Chỉnh sửa loại vé' : 'Thêm loại vé'}
      okText={editingData ? 'Cập nhật' : 'Tạo mới'}
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item 
          label="Tên vé" 
          name="name" 
          rules={[{ required: true, message: 'Vui lòng nhập tên vé' , min: 3, max: 100}]}
        >
          <Input placeholder="Nhập tên vé" />
        </Form.Item>
        
        <Form.Item 
          label="Mô tả" 
          name="description"
          rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
        >
          <Input.TextArea rows={3} placeholder="Nhập mô tả vé" />
        </Form.Item>
        
        <Form.Item 
          label="Giá vé (VND)" 
          name="price" 
          rules={[
            { required: true, message: 'Vui lòng nhập giá vé' },
            { type: 'number', min: 0, message: 'Giá vé phải lớn hơn hoặc bằng 0' }
          ]}
        >
          <InputNumber 
            min={0} 
            style={{ width: '100%' }} 
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\$\s?|(,*)/g, '')}
            placeholder="Nhập giá vé"
          />
        </Form.Item>
        
        <Form.Item 
          label="Số ngày hiệu lực" 
          name="validityDays" 
          rules={[
            { required: true, message: 'Vui lòng nhập số ngày' },
            { type: 'number', min: 0, message: 'Số ngày phải lớn hơn hoặc bằng 0' }
          ]}
        >
          <InputNumber 
            min={0} 
            style={{ width: '100%' }} 
            placeholder="Nhập số ngày hiệu lực"
          />
        </Form.Item>
        
        <Form.Item name="isStudent" valuePropName="checked">
          <Checkbox>Dành cho học sinh / sinh viên</Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default TicketTypeModal
