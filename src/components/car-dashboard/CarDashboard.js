import React, { useState, useEffect } from 'react';
import { Table, Input, Popconfirm, Form, Button, Select, Tag } from 'antd';
import { PlusSquareOutlined } from '@ant-design/icons';
import axios from 'axios'

const { Option } = Select
const brands = [{ name: "BMW", color: "gray" }, { name: "Mercedes", color: "red" }, { name: "Toyota", color: "cyan" }, { name: "Tesla", color: "blue" }]

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
	const brand = brands.find(brand => brand.name === children[1])
	const color = brand === undefined ? "blue" : brand.color

	if (inputType === 'selection') {
		inputNode = (
			<Select>
				{brands.map(brand => (<Option value={brand.name}>{brand.name}</Option>))}
			</Select>
		)
		children = (<Tag color={color}>{children}</Tag>)
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
	const [form] = Form.useForm();
	const [data, setData] = useState(originData);
	const [loading, setLoading] = useState(true)
	const [editingId, setEditingId] = useState('');

	const [reload, setReload] = useState(false) // flag to control fetchData hook
	useEffect(() => {
		const fetchData = async () => {
			const result = await axios.get('http://localhost:8080/api/car')
			console.log(result)
			setData(result.data)
			setLoading(false)
		}
		fetchData()
	}, [reload])
	const refreshData = () => {setReload(!reload)}

	const isEditing = (record) => record.id === editingId;

	const deleteRecord = async (record) => {
		const result = await axios.delete(`http://localhost:8080/api/car/${record.id}`)
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

	const save = async (id) => {
		try {
			const row = await form.validateFields();
			const newData = [...data];
			const index = newData.findIndex((item) => id === item.id);

			if (index > -1) {
				const item = newData[index];
				newData.splice(index, 1, { ...item, ...row });
				console.log(newData[index])
				let dto = newData[index]
				delete dto.id
				const result = await axios.post('http://localhost:8080/api/car', dto)
				console.log(result.data)
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
			console.log('Validate Failed:', errInfo);
		}
	};

	const columns = [
		{
			title: 'Owner',
			dataIndex: 'owner',
			width: '25%',
			editable: true,
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
		},
		{
			title: 'Actions',
			dataIndex: 'action',
			render: (_, record) => {
				const editable = isEditing(record);
				return editable ? (
					<span>
						<Button type="text" onClick={() => save(record.id)}>
							Save
						</Button>
						<Popconfirm title="Cancel changes?" onConfirm={cancel}>
							<Button type="text">Cancel</Button>
						</Popconfirm>
					</span>
				) : (
						<>
							<Button type="text" disabled={editingId !== ''} onClick={() => edit(record)}>
								Edit
							</Button>
							<Button danger type="text" disabled={editingId !== ''} onClick={() => deleteRecord(record)}>
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
		<Form form={form} component={false}>
			<Button onClick={save} type="primary" disabled={editingId !== ''} icon={<PlusSquareOutlined />}>
				Add a client
			</Button>
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
	);
};


export default CarDashboard;