// 运行时配置

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://next.umijs.org/docs/api/runtime-config#getinitialstate
import tg_logo from './assets/tg_icon.png';

export async function getInitialState(): Promise<{ name: string }> {
  return { name: 'TG' };
}

export const layout = () => {
  return {
    logo: tg_logo,
    menu: {
      locale: true,
    },
    style:{
      background:'#0D0D0D'
    },
  };
};