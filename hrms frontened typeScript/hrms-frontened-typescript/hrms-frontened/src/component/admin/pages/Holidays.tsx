import React, { useState, useEffect, useCallback } from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import Button from 'react-bootstrap/Button';
import InputField from '../../../utils/InputField';
// import useAxios from '../../../hooks/useAxios';
import appClient from '../../../network/AppClient';
import 'bootstrap/dist/css/bootstrap.css';
import { Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { navbarTitle } from '../../../reducers/authReducer';
import Swal from 'sweetalert2';
import { Pagination } from '../../../hooks/usePaginationRange';
import { debounce } from "lodash";
import { AdminHolidayType} from '../../../types/admin/AdminInterface';


const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  date: Yup.string().required('Date is required'),
  holiday_image: Yup.mixed().required('Holiday Image is required'),
});

const Holidays = () => {
  // const axiosInstance = useAxios();
  const [holidays, setHolidays] = useState<AdminHolidayType[]>([]);
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showAddModel, setShowAddModal] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const rowsPerPage : number= 1;
  const [totalPages, setTotalPages] = useState<number>(1);
  const [refresh, setRefresh] = useState<number>(0);
  const [name, setName] = useState<string>("");
  const [myDate, setMyDate] = useState<string>("");
  const [selectedHoliday, setSelectedHoliday] = useState<AdminHolidayType | undefined>(undefined);
  const dispatch = useDispatch();
  dispatch(navbarTitle({ navTitle: "Holidays" }));

  const debouncedFetchHolidays = useCallback(debounce((name: string, date : string)=>
    fetchHolidays(1,name,date),800),[])

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value
    setName(event.target.value);
    setCurrentPage(1)
    debouncedFetchHolidays(newName,myDate)
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMyDate(event.target.value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleHolidayAddSubmit = async (values: AdminHolidayType, { setSubmitting, setErrors, setValues }: FormikHelpers<AdminHolidayType>) => {
    const formData = new FormData();
    if (values.holiday_image && values.holiday_image instanceof File) {
      formData.append('holiday_image', values.holiday_image);
    }
    formData.append('date', values.date);
    formData.append('name', values.name);

    try {
      await appClient.post('api/holidays/', formData, {
        headers: {  
          'Content-Type': 'multipart/form-data',
        },
      });
      setShowAddModal(false);
      Swal.fire('Success!', 'Holiday is added successfully!', 'success');
      setRefresh(refresh + 1);
    } catch (err) {
      setErrors({ error: 'Something Went Wrong' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleHolidayUpdateSubmit = async (values: AdminHolidayType, { setSubmitting, setErrors }: FormikHelpers<AdminHolidayType>) => {
    const formData = new FormData();
    if (values.holiday_image && values.holiday_image instanceof File) {
      formData.append('holiday_image', values.holiday_image);
    }
    formData.append('date', values.date);
    formData.append('name', values.name);

    try {
      await appClient.put(`api/holidays/${selectedHoliday?.id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setShowUpdateModal(false);
      Swal.fire('Success!', 'Holiday is updated successfully!', 'success');
      setRefresh(refresh + 1);
    } catch (err) {
      setErrors({ error: 'Something Went Wrong' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      await appClient.delete(`api/holidays/${selectedHoliday?.id}/`);
      setShowDeleteModal(false);
      Swal.fire('Success!', 'Holiday is deleted successfully!', 'success');
      setRefresh(refresh + 1);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddHoliday = () => {
    setShowAddModal(true);
  };

  const fetchHolidays = async (page: number, name: string, date: string) => {
    const result = await appClient.get('/api/holidays', {
      params: {
        page,
        name,
        date,
      },
    });
    if (result.data.count === 0) {
      setTotalPages(1);
    } else {
      setTotalPages(Math.ceil(result.data.count / rowsPerPage));
    }
    setHolidays(result.data["results"]);
  };

  useEffect(() => {
    fetchHolidays(currentPage, name, myDate);
  }, [currentPage, refresh, myDate]);

  const handleUpdate = (holiday: AdminHolidayType) => {
    setSelectedHoliday(holiday);
    setShowUpdateModal(true);
  };

  const handleDelete = (holiday: AdminHolidayType) => {
    setSelectedHoliday(holiday);
    setShowDeleteModal(true);
  };

  return (
    <div style={{ marginLeft: `260px` }}>
      <Button onClick={handleAddHoliday}> Add Holidays </Button>
      <Button style={{ float: `right` }}>
        <input type="text" onChange={handleNameChange} placeholder='Search Holiday Name'></input>
      </Button>
      <Button style={{ float: `right` }}>
        <input type="date" onChange={handleDateChange}></input>
      </Button>

      <Modal show={showAddModel} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Holiday</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{ name: '', date: '', holiday_image: null,error : undefined }}
            validationSchema={validationSchema}
            onSubmit={handleHolidayAddSubmit}
          >
            {({ values, setFieldValue, handleChange, handleBlur, isSubmitting, errors, touched }) => (
              <Form>
                <h3 className="Auth-form-title">Add Holidays</h3>
                {errors.error && <p className="text-danger">{errors.error}</p>}
                <InputField
                  label="Name"
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter Holiday Name"
                  isInvalid={touched.name && !!errors.name}
                  error={errors.name}
                />
                <InputField
                  label="Date"
                  type="date"
                  name="date"
                  value={values.date}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter Date"
                  isInvalid={touched.date && !!errors.date}
                  error={errors.date}
                />
                <label>Holiday Image</label>
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  name="holiday_image"
                  onChange={(event) => {
                    if (event.currentTarget.files) {
                      setFieldValue('holiday_image', event.currentTarget.files[0]);
                    }
                  }}
                  onBlur={handleBlur}
                  className={touched.holiday_image && errors.holiday_image ? 'is-invalid' : ''}
                />
                {touched.holiday_image && errors.holiday_image && <div className="invalid-feedback">{errors.holiday_image}</div>}
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                  Submit
                </Button>
              </Form>
            )}
          </Formik>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Update Modal */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Holiday</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              name: selectedHoliday?.name || '',
              date: selectedHoliday?.date || '',
              holiday_image: selectedHoliday?.holiday_image || null,
              error : selectedHoliday?.error 
            }}
            validationSchema={validationSchema}
            onSubmit={handleHolidayUpdateSubmit}
          >
            {({ values, setFieldValue, handleChange, handleBlur, isSubmitting, errors, touched }) => (
              <Form>
                <h3 className="Auth-form-title">Update Holidays</h3>
                {errors.error && <p className="text-danger">{errors.error}</p>}
                <InputField
                  label="Name"
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter Holiday Name"
                  isInvalid={touched.name && !!errors.name}
                  error={errors.name}
                />
                <InputField
                  label="Date"
                  type="date"
                  name="date"
                  value={values.date}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter Date"
                  isInvalid={touched.date && !!errors.date}
                  error={errors.date}
                />
                <label>Holiday Image</label>
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  name="holiday_image"
                  onChange={(event) => {
                    if (event.currentTarget.files) {
                      setFieldValue('holiday_image', event.currentTarget.files[0]);
                    }
                  }}
                  onBlur={handleBlur}
                  className={touched.holiday_image && errors.holiday_image ? 'is-invalid' : ''}
                />
                {touched.holiday_image && errors.holiday_image && <div className="invalid-feedback">{errors.holiday_image}</div>}
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                  Submit
                </Button>
              </Form>
            )}
          </Formik>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Holiday</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this holiday?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Close
          </Button>
          <Button variant="danger" onClick={handleDeleteSubmit}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Holiday Name</th>
            <th>Date</th>
            <th>Image</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {holidays.map((holiday) => (
            <tr key={holiday.id}>
              <td>{holiday.id}</td>
              <td>{holiday.name}</td>
              <td>{holiday.date}</td>
              <td>
                <img
                  src={typeof holiday.holiday_image === 'string' ? holiday.holiday_image : URL.createObjectURL(holiday.holiday_image as File)}
                  alt={holiday.name}
                  width="100"
                  height="100"
                />
              </td>
              <td>
                <Button onClick={() => handleUpdate(holiday)}>Update</Button>
                <Button onClick={() => handleDelete(holiday)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
    </div>
  );
};

export default Holidays;