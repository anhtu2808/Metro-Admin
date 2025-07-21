import {
  Avatar,
  Button,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Space,
  Upload,
} from "antd";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "./ModalFormContent.css";
import { CameraOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { uploadContentImageAPI } from "../../apis";
import ButtonPrimary from "../../components/PrimaryButton/PrimaryButton";
import { useEffect, useState } from "react";

const getTypeLabel = (type) => {
  switch (type) {
    case "NEWS":
      return "Tin tức";
    case "GUIDELINE":
      return "Hướng dẫn";
    default:
      return "Nội dung";
  }
};

function MyUploadAdapter(loader) {
  this.loader = loader;
}

MyUploadAdapter.prototype.upload = async function () {
  const data = new FormData();
  data.append("file", await this.loader.file);

  const response = await uploadContentImageAPI(data);
  if (response.code === 200) {
    return { default: response.result }; // trả về URL ảnh
  } else {
    throw new Error("Upload ảnh thất bại");
  }
};

function MyCustomUploadAdapterPlugin(editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
    return new MyUploadAdapter(loader);
  };
}

const ContentFormModal = ({
  currentContent,
  isModalVisible,
  handleCancel,
  form,
  handleSubmit,
  imageUrl,
  setImageUrl,
}) => {
  const type = currentContent?.type || "NEWS";
  const label = getTypeLabel(type);
  const isEdit = !!currentContent?.id;
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (isModalVisible && currentContent?.imageUrls?.[0]) {
      setImageUrl(currentContent.imageUrls[0]);
    } else if (isModalVisible && !isEdit) {
      setImageUrl("");
    }
    if (!isModalVisible) {
      setImageUrl("");
    }
  }, [isModalVisible, currentContent, isEdit]);

  // Handle image upload
  const handleImageUpload = async (file) => {
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await uploadContentImageAPI(formData);
      console.log("Upload API response:", response);
      if (response.code === 200) {
        const newImageUrl = response.result;
        setImageUrl(newImageUrl);
        message.success("Upload ảnh thành công!");
      } else {
        message.error("Upload ảnh thất bại!");
      }
    } catch (error) {
      message.error("Upload ảnh thất bại!");
    } finally {
      setUploadingImage(false);
    }

    return false; // Prevent default upload behavior
  };

  return (
    <Modal
      title={isEdit ? `Chỉnh sửa ${label}` : `Thêm ${label} mới`}
      open={isModalVisible}
      onCancel={handleCancel}
      footer={null}
      width={700}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Hình ảnh Nội dung">
          <div className="content-image-upload">
            <div className="image-preview">
              <Avatar
                size={120}
                src={imageUrl}
                icon={<EnvironmentOutlined />}
                shape="square"
              />
            </div>
            <div className="upload-controls">
              <Upload
                name="contentImage"
                beforeUpload={handleImageUpload}
                showUploadList={false}
                accept="image/*"
              >
                <ButtonPrimary
                  icon={<CameraOutlined />}
                  loading={uploadingImage}
                  htmlType="button"
                  ghost
                >
                  {uploadingImage ? "Đang upload..." : "Chọn ảnh"}
                </ButtonPrimary>
              </Upload>
              {imageUrl && (
                <Button onClick={() => setImageUrl("")} danger type="text">
                  Xóa ảnh
                </Button>
              )}
            </div>
          </div>
        </Form.Item>
        <Form.Item
          name="title"
          label="Tiêu đề"
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
        >
          <Input placeholder={`Nhập tiêu đề ${label}`} />
        </Form.Item>

        <Form.Item
          name="date"
          label="Ngày đăng"
          rules={[{ required: true, message: "Vui lòng chọn ngày đăng!" }]}
        >
          <DatePicker
            showTime
            format="DD/MM/YYYY HH:mm:ss"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item label="Nội dung" required>
          <CKEditor
            editor={ClassicEditor}
            config={{
              extraPlugins: [MyCustomUploadAdapterPlugin],
              image: {
                toolbar: [
                  "imageTextAlternative",
                  "|",
                  "imageStyle:alignLeft",
                  "imageStyle:full",
                  "imageStyle:alignRight",
                  "|",
                  "resizeImage",
                ],
                resizeOptions: [
                  {
                    name: "resizeImage:original",
                    label: "Original",
                    value: null,
                  },
                  {
                    name: "resizeImage:50",
                    label: "50%",
                    value: "50",
                  },
                  {
                    name: "resizeImage:75",
                    label: "75%",
                    value: "75",
                  },
                ],
                resizeUnit: "%",
              },
            }}
            data={form.getFieldValue("content") || ""}
            onChange={(event, editor) => {
              form.setFieldsValue({ content: editor.getData() });
            }}
          />

          <Form.Item
            name="content"
            noStyle
            rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
          >
            <Input type="hidden" />
          </Form.Item>
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              {isEdit ? "Cập nhật" : "Thêm mới"}
            </Button>
            <Button onClick={handleCancel}>Hủy</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ContentFormModal;
