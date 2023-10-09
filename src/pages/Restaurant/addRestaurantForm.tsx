import { Modal, Form, Input, message } from 'antd';
import React, { useEffect, PropsWithChildren } from 'react';

import { gql, useMutation } from '@apollo/client';



const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 12 },
};

interface RestaurantDataType {
  id: string;
  attributes: RestaurantAttribute;
}

interface RestaurantAttribute {
  name: string;
  age: number;
}

interface CreateFormProps {
  isModalVisible: boolean;
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  activeRestaurantObj: null | RestaurantDataType;
  setActiveRestaurantObj: React.Dispatch<
    React.SetStateAction<RestaurantDataType | null>
  >;
  toGetRestaurantList: () => void;
}

const RestaurantAddQuery = gql`
  mutation($data: CreateHotelInput!){
    createHotel(createHotelInput: $data){
      id:_id
      name
    }
  }
`;

const RestaurantUpdateQuery = gql`
  mutation($id: String!, $data: UpdateHotelInput!){
    updateHotel(id: $id, updateHotelInput: $data){
      id:_id
      name
    }
  }
`;


const RestaurantForm: React.FC<PropsWithChildren<CreateFormProps>> = (props) => {
  const {
    isModalVisible,
    setIsModalVisible,
    activeRestaurantObj,
    setActiveRestaurantObj,
    toGetRestaurantList
  } = props;

  const [form] = Form.useForm();

  const [toCreateRestaurant, { loading: createLoading }] = useMutation(RestaurantAddQuery, {
    onCompleted: () => {
      toGetRestaurantList()
      setIsModalVisible(false);
    },
    onError: (err) => {
      message.warn(err.message)
    }
  });

  const [toUpdateRestaurant, { loading: updateLoading }] = useMutation(RestaurantUpdateQuery, {
    onCompleted: () => {
      toGetRestaurantList()
      setIsModalVisible(false);
    },
    onError: (err) => {
      message.warn(err.message)
    }
  });

  const handleOk = () => {
    
    form
      .validateFields()
      .then(async (values: RestaurantAttribute) => {
        console.log(values);


        // edit 
        if (activeRestaurantObj) {
          
          toUpdateRestaurant({
            variables:{
              id: activeRestaurantObj.id,
              data: values
            }
          })
        } else {
        // add new
          toCreateRestaurant({
            variables:{
              data: values
            }
          })
        }

      })
      .catch((errorInfo) => {
        console.log(errorInfo);
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onFinish = async (values: any) => {
    console.log(values);
  };

  const afterClose = () => {
    form.resetFields();
    setActiveRestaurantObj(null);
  };

  useEffect(() => {
    if (isModalVisible && activeRestaurantObj) {
      console.log(activeRestaurantObj);
      form.setFieldsValue(activeRestaurantObj);
    }
  }, [isModalVisible, activeRestaurantObj]);

  return (
    <Modal
      title={activeRestaurantObj ? `Edit Restaurant` : `Create Restaurant`}
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      afterClose={afterClose}
      okText="Confirm"
      cancelText="Cancel"
      okButtonProps={{loading: createLoading || updateLoading}}
      
    >
      <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="address" label="address" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        {/* <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item> */}
      </Form>
    </Modal>
  );
};

export default RestaurantForm;
