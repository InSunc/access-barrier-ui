import React, { useState } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Button, Select, Tag } from 'antd';

const { Option } = Select
const originData = [];
const brands = [{name: "BMW", color:"gray"}, {name: "Mercedes", color: "red"}, {name: "Toyota", color: "cyan"}, {name: "Tesla", color:"blue"}]

for (let i = 0; i < 100; i++) {
	originData.push({
		key: i.toString(),
		owner: `Edrward ${i}`,
		brand: brands[Math.floor(Math.random() * brands.length)].name,
		plateNumber: `${Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 3).toUpperCase()} ${Math.floor(Math.random() * 1000000).toString()}`,
	});
}

const EditableCell = ({
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
	if (inputType === 'selection') {
		inputNode = (
			<Select>
				{brands.map(brand => (<Option value={brand.name}>{brand.name}</Option>))}
			</Select>
		)
		children = (<Tag value={children} color={brands.find(brand => brand.name === children[1]).color}>{children}</Tag>)
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
	const [editingKey, setEditingKey] = useState('');

	const isEditing = (record) => record.key === editingKey;

	const deleteRecord = (record) => {
		console.log(record)
	};

	const edit = (record) => {
		form.setFieldsValue({
			owner: '',
			model: '',
			plateNumber: '',
			...record,
		});
		setEditingKey(record.key);
	};

	const cancel = () => {
		setEditingKey('');
	};

	const save = async (key) => {
		try {
			const row = await form.validateFields();
			const newData = [...data];
			const index = newData.findIndex((item) => key === item.key);

			if (index > -1) {
				const item = newData[index];
				newData.splice(index, 1, { ...item, ...row });
				setData(newData);
				setEditingKey('');
			} else {
				newData.push(row);
				setData(newData);
				setEditingKey('');
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
						<Button type="text" onClick={() => save(record.key)}>
							Save
						</Button>
						<Popconfirm title="Cancel changes?" onConfirm={cancel}>
							<Button type="text">Cancel</Button>
						</Popconfirm>
					</span>
				) : (
						<>
							<Button type="text" disabled={editingKey !== ''} onClick={() => edit(record)}>
								Edit
							</Button>
							<Button danger type="text" disabled={editingKey !== ''} onClick={() => deleteRecord(record)}>
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
			<Table
				components={{
					body: {
						cell: EditableCell,
					},
				}}
				dataSource={data}
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