import React, {useState, useEffect} from 'react'
import axios from 'axios'
import Constants from '../constants'
import { Input, Row, Table, Tag } from 'antd';

const { Search } = Input

const columns = [
	{
	  title: 'Arrived',
	  dataIndex: 'dateFrom',
	  width: '40%',
	  sorter: {
		compare: (a, b) => new Date(a) - new Date(b)
	  },
	  render: (_, record) => {
		let dateFrom = new Date(record["dateFrom"])
		dateFrom = dateFrom.toString()
		dateFrom = dateFrom.substring(0, dateFrom.lastIndexOf(':'))
		return (<>{dateFrom}</>)
	  }
	},
	{
	  title: 'Left',
	  dataIndex: 'dateTo',
	  width: '40%',
	  sorter: {
		compare: (a, b) => new Date(a) - new Date(b),
	  },
	  render: (_, record) => {
		console.log('This')
		console.log(record)
		if (record["dateTo"] !== null) {
			let dateTo = new Date(record["dateTo"])
			dateTo = dateTo.toString()
			dateTo = dateTo.substring(0, dateTo.lastIndexOf(':'))
			return (<>{dateTo}</>)
		} else {
			return (<Tag color="green" style={{"font-size": 15}}>Parked</Tag>)
		}
	  }
	},
	{
	  title: 'Time',
	  dataIndex: 'dateTo',
	  width: '20%',
	  sorter: {
		compare: (a, b) => new Date(a) - new Date(b),
	  },
	  render: (_, record) => {
		console.log('This')
		if (record["dateTo"] !== null) {
			let dateTo = new Date(record["dateTo"])
			let dateFrom = new Date(record["dateFrom"])
			dateTo = dateTo.toString()
			dateTo = dateTo.substring(0, dateTo.lastIndexOf(':'))
			return (<>{dateFrom - dateTo}</>)
		} else {
			return (<></>)
		}
	  }
	},
  ];


  function onChange(pagination, filters, sorter, extra) {
	console.log('params', pagination, filters, sorter, extra);
  }


function ParkingHistory() {
	const [data, setData] = useState([])
	const [searchTerm, setSearchTerm] = useState('')
	
	const [reload, setReload] = useState(false) // flag to control fetchData hook
	useEffect(() => {
		const fetchData = async () => {
			const result = await axios.get(Constants.CAR_HISTORY_ENDPOINT(searchTerm))

			// Format date
			let formatedData = result.data
			// formatedData.forEach(element => {
			// 	let dateFrom = new Date(element["dateFrom"])
			// 	dateFrom = dateFrom.toString()
			// 	dateFrom = dateFrom.substring(0, dateFrom.lastIndexOf(':'))
			// 	element["dateFrom"] = dateFrom.toString()

			// 	if (element["dateTo"] !== null) {
			// 		let dateTo = new Date(element["dateTo"])
			// 		dateTo = dateTo.toString()
			// 		dateTo = dateTo.substring(0, dateTo.lastIndexOf(':'))
			// 		element["dateTo"] = dateTo.toString()
			// 	}
			// });
			// console.log(formatedData)
			setData(formatedData)
		}
		fetchData()
	}, [reload])

	const refreshData = () => { setReload(!reload) }

	const onSearch = (searchString) => {
		setSearchTerm(searchString)
		refreshData()
	}

	return (
		<>
			<Row>
				<Search placeholder="Plate number" onSearch={onSearch} enterButton />
			</Row>
			<Table columns={columns} dataSource={data} onChange={onChange} />
		</>
	)
}

export default ParkingHistory;