import React from 'react';
import { Spin } from 'antd';



export default (props: object) => (
  <div>
    <Spin
      {...props}
      size="large"
      style={{ 
        position: 'absolute', 
        top: '50%', 
        left: '50%', 
        margin: '-16px 0 0 -16px',
        zIndex: 9000,
      }}
    />
  </div>
);