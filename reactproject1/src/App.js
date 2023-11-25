import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import axios from 'axios';
import CreateNewAudit from './Create.js'
import cellEditFactory from 'react-bootstrap-table2-editor';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import {  FaPencilAlt, FaTrash} from 'react-icons/fa';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { format } from 'date-fns';
import Swal from 'sweetalert2';



function App() {
	const [audits, setAudit] = useState([]);

	//============ pagination ===============================
	const [totalSize, setTotalSize] = useState(0);
	const [page, setPage] = useState(1);
	const [sizePerPage, setSizePerPage] = useState(3);
	//========================================================

	const [showModal, setShowModal] = useState(false);
	//======================Validation========================
	const [validated, setValidated] = useState(false);
	//========================================================
	//===================Form=================================
	const [newid, setNewId] = useState(null);
	const [newAction, setNewAction] = useState('');
	const [newEmpid, setNewEmpid] = useState('');
	const [newUserid, setNewUserid] = useState('');
	const [newTimestamp, setNewTimestamp] = useState(new Date());
	//========================================================
	const [users, setUsers] = useState([]);
	const [emps, setEmps] = useState([]);
	//===========================================================


	const editAudit = async (id) => {
		try {
			const response = await axios.put(`https://localhost:7132/api/AuditModels/${id}`, {
				id: id,
				action: newAction,
				userModelId: newUserid,
				employeeModelId: newEmpid,
				timestamp: newTimestamp
			});


		} catch (error) {
			console.error('Error adding todo:', error);
		}
	};

	const handleSubmit = (event) => {
		const form = event.currentTarget;
		if (form.checkValidity() === false) {
			event.preventDefault();
			event.stopPropagation();
		}


		setValidated(true);
	};


	useEffect(() => {
		// Fetch Audits when the component mounts
		fetchAudits(page, sizePerPage);
		fetchUsers();
		fetchEmps();
	}, [page, sizePerPage]);


	const fetchUsers = async () => {
		try {
			const response = await axios.get('https://localhost:7132/api/UserModels');
			setUsers(response.data);
		} catch (error) {
			console.error('Error fetching audit:', error);
		}
	};
	const fetchEmps = async () => {
		try {
			const response = await axios.get('https://localhost:7132/api/EmployeeModels');
			setEmps(response.data);
		} catch (error) {
			console.error('Error fetching audit:', error);
		}
	};
	const fetchAudits = async (page, sizePerPage) => {
		try {
			const response = await axios.get("https://localhost:7132/api/AuditModels?page="+page +"&size="+sizePerPage);
			setAudit(response.data);
			setTotalSize(response.data.totalItems);

		} catch (error) {
			console.error('Error fetching audit:', error);
		}
	};
	const buttonCanStyle = {
	
		marginRight: '10px',
		marginLeft: '10px',
	};
	

	// Table columns definition
	const columns = [
		// Define your columns here
		/*{ dataField: 'id', text: 'ID' },*/
		{ dataField: 'employeename', text: 'EmpName', editable: false },
		{ dataField: 'username', text: 'UserName', editable: false },
		{ dataField: 'actionname', text: 'ActionName',  editable: false },
		{ dataField: 'timestamp', text: 'Timestamp',  editable: false },
		{
			
			text: '',
			editable: false,
			formatter: (cell, row) => (
				<div>
					<Button  variant="success" style={buttonCanStyle} onClick={() => handleEdit(row.id)}>
						<FaPencilAlt /> Edit
					</Button>
					
				</div>
			),
		},
		{

			text: '',
			editable: false,
			formatter: (cell, row) => (
				<div>
					
					<Button variant="danger" style={buttonCanStyle} onClick={() => handleDelete(row.id)}>
						<FaTrash /> Remove</Button>
				</div>
			),
		},
		// Add more columns as needed
	];

	// Define pagination options
	const paginationOptions = {
		page,
		sizePerPage,
		totalSize,
		onPageChange: (newPage, newSizePerPage) => {
			setPage(newPage);
			setSizePerPage(newSizePerPage);
		},
	};

	const handleEdit = async (id) => {
		// Implement your edit logic here

		
		setShowModal(true);
		try {
			const response = await axios.get(`https://localhost:7132/api/AuditModels/${id}`);
			setNewId(id);
			setNewAction(response.data.action)
			setNewUserid(response.data.userModelId)
			setNewEmpid(response.data.employeeModelId)
			const t = new Date(response.data.timestamp);
			
			setNewTimestamp(t);

		} catch (error) {
			console.error('Error get audit:', error);
		}

	};

	// Delete button click handler
	const handleDelete =  (id) => {
		Swal.fire({
			title: 'Are you sure?',
			text: 'You will not be able to recover this data!',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#d33',
			cancelButtonColor: '#3085d6',
			confirmButtonText: 'Yes, delete it!'
		}).then((result) => {
			if (result.isConfirmed) {
				try {
					const response =  axios.delete(`https://localhost:7132/api/AuditModels/${id}`);
					fetchAudits(page, sizePerPage);
				} catch (error) {
					console.error('Error deleting audit:', error);
				}

			}
		});

				console.log('Delete clicked for ID:', id);
	};

	const handleCloseModal = () => {
		setShowModal(false);
	};
	

	return (


		<div>
			<Navbar bg="dark" variant="dark">
				<Container>
					<Navbar.Brand href="#home">Navbar</Navbar.Brand>
					<Nav className="me-auto">
						<Nav.Link href="#home">Home</Nav.Link>
						<Nav.Link href="#features">Features</Nav.Link>
						<Nav.Link href="#pricing">Pricing</Nav.Link>
					</Nav>
				</Container>
			</Navbar>

			<div className="container mt-5">
				<CreateNewAudit />

				<BootstrapTable
					keyField="id"
					data={audits}
					columns={columns}
					pagination={paginationFactory(paginationOptions)}
					cellEdit={cellEditFactory({ mode: 'click', blurToSave: true })}
					
					
				/>


			

			</div>

			<Modal show={showModal} onHide={handleCloseModal}>
				<Modal.Header closeButton>
					<Modal.Title>Edit Details</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form noValidate validated={validated} onSubmit={handleSubmit}>
						<Form.Control type="hidden" value={newid} />
						<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
							<Form.Label>Action</Form.Label>
							<Form.Control type="text"
								required
								value={newAction}
								onChange={(e) => setNewAction(e.target.value)}
								placeholder="Enter an action" />
							<Form.Control.Feedback>Looks good!</Form.Control.Feedback>
							<Form.Control.Feedback type="invalid">
								Please enter an action.
							</Form.Control.Feedback>
						</Form.Group>
						<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
							<Form.Label>User</Form.Label>
							<Form.Select required aria-label="Default select example" value={newUserid} onChange={(e) => setNewUserid(e.target.value)} >
								<option value=''>Select User</option>
								
								{users.map((user) => (	
									
									 <option  value={user.id}>{user.name}</option>
								))}
							</Form.Select>
							<Form.Control.Feedback type="invalid">
								Choose...
							</Form.Control.Feedback>
						</Form.Group>
						<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
							<Form.Label>Employee</Form.Label>
							<Form.Select required aria-label="Default select example"
								value={newEmpid} onChange={(e) => setNewEmpid(e.target.value)}>
								<option value=''>Select Employee</option>
								{emps.map((emp) => (
									<option value={emp.id}>{emp.name}</option>
								))}
							</Form.Select>
							<Form.Control.Feedback type="invalid">
								Choose...
							</Form.Control.Feedback>
						</Form.Group>
						<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
							<Form.Label>Time</Form.Label>
							<Form.Control required type="date" placeholder="Enter an user"
								value={format(newTimestamp, 'yyyy-MM-dd')} onChange={(e) => setNewTimestamp(new Date(e.target.value))}   />
							<Form.Control.Feedback type="invalid">
								Please pick a date.
							</Form.Control.Feedback>
						</Form.Group>
						
						<Modal.Footer>
							<Button variant="secondary" onClick={handleCloseModal}>
								Close
							</Button>
							<Button variant="primary" type="submit" onClick={() => editAudit(newid)}>
								Save Modification
							</Button>
						</Modal.Footer>
					</Form>
				</Modal.Body>
				
			</Modal>

		</div>

	);
}





export default App;
