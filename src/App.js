import './App.css';
import { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";
import {
  FieldTimeOutlined,
  IdcardOutlined,
  CheckSquareOutlined,
} from '@ant-design/icons';
import { Layout, Menu, } from 'antd';
import CarDashboard from './components/CarDashboard';
import ParkingLot from './components/ParkingLot';
import ParkingHistory from './components/ParkingHistory';

const { Header, Content, Footer, Sider } = Layout;

function App() {
  const [collapsed, setCollapsed] = useState(false)
  // document.addEventListener("keydown", () => {setCollapsed(!collapsed)})
  const [selectedMenuKey, setSelectedMenuKey] = useState("0")

  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
          {/* <div className="logo"/> */}
          <Menu theme="dark" defaultSelectedKeys="0" mode="inline">
            <Menu.Item key="0" icon={<IdcardOutlined  />}>
              <Link to="/cars">
                Manage clients
              </Link>
            </Menu.Item>
            <Menu.Item key="1" icon={<CheckSquareOutlined />}>
              <Link to="/parking-lot">
                Parking Lot
              </Link>
            </Menu.Item>
            <Menu.Item icon={<FieldTimeOutlined />}>
              <Link to="/parking-history">
                Parking History
              </Link>
            </Menu.Item>
          </Menu>
        </Sider>

        <Layout className="site-layout">
          <Content style={{ margin: '0 16px' }}>
            <div style={{ padding: 24, minHeight: 360 }}>
              <Switch>
                <Route exact path="/" component={CarDashboard} />
                <Route path="/cars" component={CarDashboard} />
                <Route path="/parking-lot" component={ParkingLot} />
                <Route path="/parking-history" component={ParkingHistory} />
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
