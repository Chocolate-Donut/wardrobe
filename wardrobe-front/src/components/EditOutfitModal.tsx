import React, { /* useState,  */useEffect } from 'react';
import { Modal, Input, Select, Switch, Form, Button, /* Tag */ } from 'antd';

const { Option } = Select;

interface EditOutfitModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (updated: any) => void;
  outfit: any;
}

const EditOutfitModal: React.FC<EditOutfitModalProps> = ({ visible, onClose, onSave, outfit }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (outfit) {
      form.setFieldsValue({
        title: outfit.title,
        season: outfit.season,
        trend: outfit.trend,
        isPrivate: outfit.isPrivate,
        tags: typeof outfit.tags === 'string' ? JSON.parse(outfit.tags) : outfit.tags,
      });
    }
  }, [outfit]);

  const handleFinish = (values: any) => {
    onSave({ ...outfit, ...values });
    onClose();
  };

  return (
    <Modal
      title="Edit Look"
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item name="title" label="Title">
          <Input />
        </Form.Item>
        <Form.Item name="season" label="Season">
          <Select>
            <Option value="spring">Spring</Option>
            <Option value="summer">Summer</Option>
            <Option value="autumn">Autumn</Option>
            <Option value="winter">Winter</Option>
          </Select>
        </Form.Item>
        <Form.Item name="trend" label="Trend">
          <Select>
            <Option value="casual">Casual</Option>
            <Option value="glamor">Glamor</Option>
            <Option value="classic">Classic</Option>
          </Select>
        </Form.Item>
        <Form.Item name="tags" label="Tags">
          <Select mode="tags" />
        </Form.Item>
        <Form.Item name="isPrivate" label="Private" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Button type="primary" htmlType="submit" block>Save</Button>
      </Form>
    </Modal>
  );
};

export default EditOutfitModal;
