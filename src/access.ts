import { USER_TYPE } from "./constants";

export default (initialState: API.UserInfo) => {
  // 在这里按照初始化数据定义项目中的权限，统一管理
  // 参考文档 https://next.umijs.org/docs/max/access
  // const canSeeAdmin = !!(
  //   initialState && initialState.name !== 'dontHaveAccess'
  // );


  return {
    //只有管理员可访问
    adminRouteFilter: () => {
      let role = sessionStorage.getItem("role")
      if(role === USER_TYPE.EMPLOYEE){
        return true
      }
      return false
    }
    , // initialState 中包含了的路由才有权限访问
    // normalRouteFilter: (route) => hasRoutes.includes(route.name), // initialState 中包含了的路由才有权限访问
  };
};
