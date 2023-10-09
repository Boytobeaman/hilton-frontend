import { Spin } from 'antd';

// 此组件在页面中的默认结构位置为
// body #root .ant-pro section.ant-layout div.ant-layout main.ant-layout-content div.page-loading-component

// 定义前端页面组件切换时，页面的loading 效果
const LoadingComponent: React.FC = () => {
  return (
    <div
      className="page-loading-component"
      style={{
        position: 'absolute',
        height: '100vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Spin tip="Loading..."></Spin>
    </div>
  );
};

export default LoadingComponent;
