import React, { useState, useEffect } from 'react';
import { Table, Row, Col, Input, Button, Space, Statistic, Tag } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import axios from 'axios'
import Constants from '../constants'



class ParkingLot extends React.Component {
	state = {
		searchText: '',
		searchedColumn: '',
		totalClientsNr: 0,
		onSiteClients: 0,
		data: []
	};

	componentDidMount() {
		axios.get(Constants.CAR_ENDPOINT).then(response => {
			console.log('this ' + response.data.length);
			this.setState({
				totalClientsNr: response.data.length
			})
		})

		axios.get(`${Constants.PARKING_ENDPOINT}/cars-in-parking-area`).then(response => {
			this.setState({
				data: response.data,
				onSiteClients: response.data.length
			})
			console.log(response.data)
		})
	}

	getColumnSearchProps = dataIndex => ({
		filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
			<div style={{ padding: 8 }}>
				<Input
					ref={node => {
						this.searchInput = node;
					}}
					placeholder={`Search ${dataIndex}`}
					value={selectedKeys[0]}
					onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
					onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
					style={{ width: 188, marginBottom: 8, display: 'block' }}
				/>
				<Space>
					<Button
						type="primary"
						onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
						icon={<SearchOutlined />}
						size="small"
						style={{ width: 90 }}
					>
						Search
			  </Button>
					<Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
						Reset
			  </Button>
				</Space>
			</div>
		),
		filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
		onFilter: (value, record) =>
			record[dataIndex]
				? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
				: '',
		onFilterDropdownVisibleChange: visible => {
			if (visible) {
				setTimeout(() => this.searchInput.select(), 100);
			}
		},
		render: text =>
			this.state.searchedColumn === dataIndex ? (
				<Highlighter
					highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
					searchWords={[this.state.searchText]}
					autoEscape
					textToHighlight={text ? text.toString() : ''}
				/>
			) : (
					text
				),
	});

	handleSearch = (selectedKeys, confirm, dataIndex) => {
		confirm();
		this.setState({
			searchText: selectedKeys[0],
			searchedColumn: dataIndex,
		});
	};

	handleReset = clearFilters => {
		clearFilters();
		this.setState({ searchText: '' });
	};

	render() {
		const columns = [
			{
				title: 'Owner',
				dataIndex: 'owner',
				key: 'owner',
				width: '30%',
				...this.getColumnSearchProps('owner'),
			},
			{
				title: 'Brand',
				dataIndex: 'brand',
				key: 'brand',
				width: '20%',
				render: (_, record) => {
					console.log('record')
					console.log(record)
					const brand = Constants.BRANDS.find(brand => brand.name.toLowerCase() === String(record.brand).toLowerCase())
					const color = brand === undefined ? "blue" : brand.color
					return (<Tag color={color}>{brand.name}</Tag>)
				},
			},
			{
				title: 'Plate number',
				dataIndex: 'plateNumber',
				key: 'plateNr',
				...this.getColumnSearchProps('owner'),
			},
		];
		return (
			<>
				<Row justify="end">
					<Col span="4">
						<Statistic style={{'text-align': 'center'}} valueStyle={{'text-align': 'center'}} 
							title="Clients in parking lot:" value={this.state.onSiteClients} suffix={"/ " + this.state.totalClientsNr} />	
					</Col>
				</Row>
				<Table columns={columns} dataSource={this.state.data} />
			</>
		)
	}
}

export default ParkingLot;