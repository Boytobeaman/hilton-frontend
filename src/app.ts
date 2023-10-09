import type { RequestConfig } from 'umi';

import React from 'react';
import CustomApolloProvider from '@/utils/apolloClient';

// 运行时配置

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://next.umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{ name: string }> {
  
  return { name: 'Hilton Demo' };
}

export const layout = () => {
  return {
    logo: 'https://www.hilton.com/modules/assets/svgs/logos/HH.svg',
    menu: {
      locale: false,
    },
    logout:() => {
      sessionStorage.clear();
      window.location.href="/login"
    },
  };
};

export const request: RequestConfig = {
  timeout: 10000,
  // other axios options you want
  errorConfig: {
    errorHandler() {},
    errorThrower() {},
  },
  requestInterceptors: [],
  responseInterceptors: [],
};

export const rootContainer = (container) => {
  return React.createElement(CustomApolloProvider, null, container);
};