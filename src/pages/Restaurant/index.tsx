import { PageContainer } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import styles from './index.less';
import { useState } from 'react';

import { Table, Popconfirm } from 'antd';
import AddRestaurantForm from './addRestaurantForm';

import { gql, useMutation, useQuery } from '@apollo/client';

const RestaurantQuery = gql`
  query{
    hotels{
      id:_id
      name
      address
    }
  }
`;

const RestaurantDeleteQuery = gql`
  mutation($id: String!){
    deleteHotel(id: $id){
      id: _id
      name
    }
  }
`;



interface RestaurantDataType {
  id: string;
  attributes: RestaurantAttribute;
}

interface RestaurantAttribute {
  name: string;
  age: number;
}

const RestaurantPage: React.FC = () => {
  // const [pagination, setPagination] = useState({
  //   current: 1,
  //   pageSize: 10,
  // });

  const { loading:restaurantLoading, data: restaurantData,  refetch: toGetRestaurantList} = useQuery(RestaurantQuery, {
    onCompleted: () => {

    },
    onError: (err) => {
      message.warn(err.message)
    }
  });

  const [toDeleteRestaurant] = useMutation(RestaurantDeleteQuery, {
    onCompleted: () => {
      toGetRestaurantList()
    }
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeRestaurantObj, setActiveRestaurantObj] =
    useState<null | RestaurantDataType>(null);


  const toEditRestaurant = (params: RestaurantDataType) => {
    setActiveRestaurantObj(params);
    setIsModalVisible(true);
  };



  const columns = [
    {
      title: 'name',
      dataIndex: ['name'],
      key: 'name',
    },
    {
      title: 'action',
      key: 'action',
      render: (text: any, record: RestaurantDataType) => {
        return (
          <>
            <Button
              size="small"
              style={{ marginRight: '10px' }}
              onClick={() => toEditRestaurant(record)}
            >
              edit
            </Button>
            <Popconfirm
              title="are you sure to delete？"
              onConfirm={() => toDeleteRestaurant({ 
                variables: {id: record.id}
              })}
              okText="Confirm"
              cancelText="Cancel"
            >
              <Button
                size="small"
                style={{ marginRight: '10px' }}
                className="text-rose-700"
              >
                delete
              </Button>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  // const onRestaurantTableChange = (page: number, pageSize: number) => {
  //   setPagination({
  //     current: page,
  //     pageSize,
  //   });
  // };

  const restaurants = restaurantData?.hotels || []


  return (
    <PageContainer ghost>
      <div className={styles.container}>
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          Add new
        </Button>

        <Table
          dataSource={ restaurants }
          columns={columns}
          pagination={false}
          loading={restaurantLoading}
          rowKey="id"
        />
        {/* <Pagination
          defaultCurrent={1}
          total={restaurant?.meta?.pagination?.total}
          showTotal={(total, range) =>
            `show page ${range[0]} to ${range[1]}，totally ${total} records`
          }
          onChange={onRestaurantTableChange}
          current={pagination.current}
          pageSize={pagination.pageSize}
        /> */}
        <AddRestaurantForm
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
          activeRestaurantObj={activeRestaurantObj}
          setActiveRestaurantObj={setActiveRestaurantObj}
          toGetRestaurantList={toGetRestaurantList}
        />
      </div>
    </PageContainer>
  );
};

export default RestaurantPage;
