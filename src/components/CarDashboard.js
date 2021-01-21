import React, { useState, useEffect } from 'react';
import {
	Table,
	Input,
	Popconfirm,
	Form,
	Button,
	Select,
	Tag,
	Statistic,
	Col,
	Row,
	Space
} from 'antd';
import { PlusSquareOutlined, DeleteFilled, EditOutlined, SaveOutlined, StopOutlined, SearchOutlined} from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import axios from 'axios'
import Constants from '../constants'

const { Option } = Select

const originData = [];

const EditableCell = ({
	key,
	editing,
	dataIndex,
	title,
	inputType,
	record,
	index,
	children,
	...restProps
}) => {
	// check the component type
	let inputNode;
	const brand = Constants.BRANDS.find(brand => brand.name.toLowerCase() === String(children[1]).toLowerCase())
	const color = brand === undefined ? "blue" : brand.color

	if (inputType === 'selection') {
		inputNode = (
			<Select>
				{Constants.BRANDS.map(brand => (<Option value={brand.name}>{brand.name}</Option>))}
			</Select>
		)
		children = (<Tag color={color}>{children[1]}</Tag>)
	} else {
		inputNode = (<Input />)
	}

	return (
		<td {...restProps}>
			{editing ? (
				<Form.Item
					name={dataIndex}
					style={{
						margin: 0,
					}}
					rules={[
						{
							required: true,
							message: `Missing ${title}!`,
						},
					]}
				>
					{inputNode}
				</Form.Item>
			) : (
					children
				)}
		</td>
	);
};

function CarDashboard() {
	const [form] = Form.useForm()
	const [data, setData] = useState(originData)
	const [loading, setLoading] = useState(true)
	const [editingId, setEditingId] = useState('')
	const [clientsNr, setClientsNr] = useState(0)
	const [searchText, setSearchText] = useState('')
	const [searchedColumn, setSearchedColumn] = useState('')

	const [reload, setReload] = useState(false) // flag to control fetchData hook
	useEffect(() => {
		const fetchData = async () => {
			const result = await axios.get(Constants.CAR_ENDPOINT)
			console.log(result)
			setData(result.data)
			setLoading(false)
			setClientsNr(result.data.length)
		}
		fetchData()
	}, [reload])
	const refreshData = () => {setReload(!reload)}

	const isEditing = (record) => record.id === editingId;

	const deleteRecord = async (record) => {
		const result = await axios.delete(`${Constants.CAR_ENDPOINT}/${record.id}`)
		console.log(result.status)
		refreshData()
	};

	const edit = (record) => {
		form.setFieldsValue({
			owner: '',
			model: '',
			plateNumber: '',
			...record,
		});
		setEditingId(record.id);
	};

	const cancel = () => {
		refreshData()
		setEditingId('');
	};

	const getColumnSearchProps = dataIndex => ({
		filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
			<div style={{ padding: 8 }}>
				<Input
					placeholder={`Search ${dataIndex}`}
					value={selectedKeys[0]}
					onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
					onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
					style={{ width: 188, marginBottom: 8, display: 'block' }}
				/>
				<Space>
					<Button
						type="primary"
						onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
						icon={<SearchOutlined />}
						size="small"
						style={{ width: 90 }}
					>
						Search
				</Button>
					<Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
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
		render: text =>
			searchedColumn === dataIndex ? (
				<Highlighter
					highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
					searchWords={[searchText]}
					autoEscape
					textToHighlight={text ? text.toString() : ''}
				/>
			) : (
					text
				),
	});

	const handleSearch = (selectedKeys, confirm, dataIndex) => {
		confirm();
		setSearchText(selectedKeys[0])
		setSearchedColumn(dataIndex)
	};

	const handleReset = clearFilters => {
		clearFilters();
		setSearchText('')
	};


	const save = async (id) => {
		try {
			const row = await form.validateFields();
			const newData = [...data];
			const index = newData.findIndex((item) => id === item.id);

			if (index > -1) {
				const item = newData[index];
				newData.splice(index, 1, { ...item, ...row });
				let dto = newData[index]
				//delete dto.id
				const result = await axios.post(Constants.CAR_ENDPOINT, dto)
				// newData[index] = result.data
				refreshData()
				setEditingId('');
			} else {
				// create new
				console.log(newData.length)
				const item = newData.push(row);
				console.log(newData.length)
				setData(newData);
				edit(item)
			}
		} catch (errInfo) {
			console.log('Validation Failed:', errInfo);
		}
	};

	const columns = [
		{
			title: 'Owner',
			dataIndex: 'owner',
			width: '25%',
			editable: true,
			...getColumnSearchProps('owner'),
		},
		{
			title: 'Brand',
			dataIndex: 'brand',
			width: '15%',
			editable: true,
		},
		{
			title: 'Plate number',
			dataIndex: 'plateNumber',
			width: '40%',
			editable: true,
			...getColumnSearchProps('owner'),
		},
		{
			title: 'Actions',
			dataIndex: 'action',
			render: (_, record) => {
				const editable = isEditing(record);
				return editable ? (
					<span>
						<Button type="text" onClick={() => save(record.id)} icon={<SaveOutlined />}>
							Save
						</Button>
						<Popconfirm title="Cancel changes?" onConfirm={cancel}>
							<Button type="text" icon={<StopOutlined />}>Cancel</Button>
						</Popconfirm>
					</span>
				) : (
						<>
							<Button type="text" disabled={editingId !== ''} onClick={() => edit(record)} icon={<EditOutlined/>}>
								Edit
							</Button>
							<Button danger type="text" disabled={editingId !== ''} onClick={() => deleteRecord(record)} icon={<DeleteFilled/>}>
								Delete
							</Button>
						</>
					);
			},
		},
	];
	const mergedColumns = columns.map((col) => {
		if (!col.editable) {
			return col;
		}

		return {
			...col,
			onCell: (record) => ({
				record,
				inputType: col.dataIndex === 'brand' ? 'selection' : 'text',
				dataIndex: col.dataIndex,
				title: col.title,
				editing: isEditing(record),
			}),
		};
	});

	return (
	<>
		<Row justify="space-between" align="bottom">
			<Col span={20}>
				<Button onClick={save} type="primary" disabled={editingId !== ''} icon={<PlusSquareOutlined />}>
					Add a client
				</Button>
			</Col>
			<Col span={4}>
				<Statistic  style={{'text-align': 'center'}} valueStyle={{'text-align': 'center'}} title="Total clients:" value={clientsNr} />
			</Col>
		</Row>
		<Form form={form} component={false}>
			<Table
				components={{
					body: {
						cell: EditableCell,
					},
				}}
				dataSource={data}
				loading={loading}
				columns={mergedColumns}
				rowClassName="editable-row"
				pagination={{
					onChange: cancel,
				}}
			/>
		</Form>
	</>
	);
};


export default CarDashboard;