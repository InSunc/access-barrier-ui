import './App.css';
import { useState } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import {
  CarOutlined,
  IdcardOutlined,
} from '@ant-design/icons';
import { Layout, Menu, } from 'antd';
import CarDashboard from './components/car-dashboard/CarDashboard';
import History from './components/car-dashboard/History';

const { Header, Content, Footer, Sider } = Layout;

function App() {
  const [collapsed, setCollapsed] = useState(false)
  // document.addEventListener("keydown", () => {setCollapsed(!collapsed)})

  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
          <div className="logo" />
          <CarOutlined />
          <Menu theme="dark" defaulSelectedKeys={['1']} mode="inline">
            <Menu.Item key="1" icon={<CarOutlined />}>
              <Link to="/cars">
                Manage cars
              </Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<IdcardOutlined />}>
              <Link to="/history">
                Cars log
              </Link>
            </Menu.Item>
          </Menu>
        </Sider>

        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }} />
          <Content style={{ margin: '0 16px' }}>
            <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
              <Switch>
                <Route exact path="/" component={CarDashboard} />
                <Route path="/cars" component={CarDashboard} />
                <Route path="/history" component={History} />
              </Switch>
            </div>
          </Content>

          <Footer style={{ textAlign: 'center' }}>AccessBarrier ©2020 This is a footer</Footer>
        </Layout>



      </Layout>
    </Router>
  );
}

export default App;
