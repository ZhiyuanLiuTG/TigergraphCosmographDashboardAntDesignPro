import Guide from '@/components/Guide';
import { trim } from '@/utils/format';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import styles from './index.less';
import { ConfigProvider, Card, Divider, Typography, List} from 'antd';
import en_US from 'antd/lib/locale/en_US';

const { Title, Paragraph, Text, Link } = Typography;
const data = [
  {
    title: 'Connect to TigerGraph',
    desc: 'Go to TigerGraph Configuration page. Add nickname, host, graphname, username and password of your solution and save.'
  },
  {
    title: 'Visualize your data',
    desc: 'Go to Cosmograph Visualization page. Select a connection.\
    You can select the vertices and edges from your schema, or select an installed query for data visualization.\
    You can also write an intepreted query by yourself!'
  },
  {
    title: 'Enable hardware acceleration',
    desc: 'Cosmos is a GPU-accelerated Force Graph. Turn on your hardware acceleration for best experience!'
  },
  {
    desc: 'Chrome: Settings -> System -> Use hardware acceleration when available'
  },
  {
    title: 'Please note that it takes some time to load a big data graph',
  },
  
];

export default () => {
  return(
    <Card style={{ height: 1001, width: 1000 }}>
      <Typography>
        <Title>Welcome to TigerGraph Dashboard!</Title>
        <Title level={5}>This page is a guide to show you how to use the dashboard</Title>
        <Divider />
        <List
          size="large"
          grid={{ column: 1 }}
          dataSource={data}
          renderItem={item => (
          <List.Item>
            <List.Item.Meta
          title={item.title}
        />
        {item.desc}
          </List.Item>
          )}
        />
        
      </Typography>
      
    </Card>
  );
  
}