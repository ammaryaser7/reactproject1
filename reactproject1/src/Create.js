import React, { useState } from 'react';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { useEffect } from 'react';


export default function CreateNewAudit() {

	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const [users, setUsers] = useState([]);
	const [emps, setEmps] = useState([]);

	const [newAction, setNewAction] = useState('');
	const [newEmpid, setNewEmpid] = useState('');
	const [newUserid, setNewUserid] = useState('');
	const [newTimestamp, setNewTimestamp] = useState('');



	const [audits, setAudit] = useState([]);

	useEffect(() => {
		fetchUsers();
		fetchEmps();
	}, []);

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


	const addAudit = async () => {
		try {
			const response = await axios.post('https://localhost:7132/api/AuditModels', {
				//id: '',
				action: newAction,
				userModelId: newUserid,
				employeeModelId: newEmpid,
				timestamp: newTimestamp
			
			});
			setAudit([...audits, response.data]);
			setNewAction('');
			setNewEmpid('');
			setNewUserid('');
			setNewTimestamp('');

		} catch (error) {
			console.error('Error adding todo:', error);
		}
	};
	//======================Validation===================================
	const [validated, setValidated] = useState(false);

	const handleSubmit = (event) => {
		const form = event.currentTarget;
		if (form.checkValidity() === false) {
			event.preventDefault();
			event.stopPropagation();
		}


		setValidated(true);
	};
	
	//===================================================================


	return (
		<>
			<Button variant="primary" onClick={handleShow}>
				Create New Audit
			</Button>
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Fill Auditing Form</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form noValidate validated={validated} onSubmit={handleSubmit}>
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
							<Form.Select isValid={newUserid !== ''} required aria-label="Default select example" value={newUserid} onChange={(e) => setNewUserid(e.target.value)} >
								<option value=''>Select User</option>
							{users.map((user) => (
									<option value={user.id}>{user.name}</option>
							))}
							</Form.Select>
							<Form.Control.Feedback type="invalid">
								Choose...
							</Form.Control.Feedback>
						</Form.Group>
						<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
							<Form.Label>Employee</Form.Label>
							<Form.Select isValid={newEmpid !== ''} required aria-label="Default select example" value={newEmpid} onChange={(e) => setNewEmpid(e.target.value)}>
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
							<Form.Control required type="date" placeholder="Enter an user" value={newTimestamp} onChange={(e) => setNewTimestamp(e.target.value)} />
							<Form.Control.Feedback type="invalid">
								Please pick a date.
							</Form.Control.Feedback>
						</Form.Group>
						<Modal.Footer>
							<Button variant="secondary" onClick={handleClose}>
								Close
							</Button>
							<Button variant="primary" type="submit" onClick={addAudit}>
								Create 
							</Button>
						</Modal.Footer>
					</Form>


				</Modal.Body>
			
			</Modal>

		</>

	);
}