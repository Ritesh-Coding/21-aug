import React from "react";

import Modal from "react-bootstrap/Modal";
import { Formik, Form,FormikHelpers } from "formik";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// import useAxios from "../../../hooks/useAxios";
import appClient from "../../../network/AppClient";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Swal from "sweetalert2";
import Card from "react-bootstrap/Card";
import { RootState } from "../../../types/types";
import "./Admin.css"
import { EmployeeDataType ,DocumentsType,RelationsType,ProfileType} from "../../../types/user/UserInterface";


const Profile : React.FC= () => {
  const [employeeData, setEmployeeData] = useState<EmployeeDataType | undefined>(undefined);
  const [relationsData, setRelationsData] = useState<RelationsType | undefined>(undefined);
  const [documentsData, setDocumentsData] = useState<DocumentsType | undefined>(undefined);
  const { userId } = useSelector((state : RootState) => state.auth);
  // const [update, setUpdate] = useState(false);
  // const axiosInstance = useAxios();
  const id = userId;
  const [show, setShow] = useState<boolean>(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleProfilePicSubmit = async (
    values : ProfileType,
    { setSubmitting, setErrors } : FormikHelpers<ProfileType>
  ) => {
    const formData = new FormData();
    if (values.profile) formData.append("profile", values.profile);
    try {
      const response = await appClient.patch(`/profile/${id}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
   
      setEmployeeData(response.data);
      handleClose();
      Swal.fire("Success!", "Profile Pic Updated Successfully!", "success");
   
    } catch (error) {
   
      setErrors({ api: "Failed to update Profile Image" });
    } finally {
      setSubmitting(false);
    }
  };
  useEffect(() => {
    appClient.get(`/profile/${userId}/`).then((res) => {
      setEmployeeData(res.data);
      setRelationsData(res.data["relations"][0]);
      setDocumentsData(res.data["documents"][0]);
    });
  }, []);

  return (
    <>
      <div className="dashBoardrow">
        <div className="dashBoardcol1">
          <div
            style={{
              marginLeft: `20px`,
              display: `flex`,
            }}
          >
            <div
              className="e-card e-card-horizontal"
              style={{ marginLeft: `50px` }}
            >
              <Card style={{ width: "30rem" }} className="mb-2">
                <Card.Header><h4>Basic Information</h4></Card.Header>
                <Card.Body>
                  <Card.Text>
                    <p>
                      First Name:
                      <strong className="adminProfileBasicDetails">
                        {employeeData?.["first_name"]}
                      </strong>
                    </p>
                    <p>
                      Last Name :
                      <strong className="adminProfileBasicDetails">
                        {employeeData?.["last_name"]}
                      </strong>
                    </p>
                    <p>
                      Email :
                      <strong className="adminProfileBasicDetails">
                        {employeeData?.["email"]}
                      </strong>
                    </p>
                    <p>
                      Date Of Birth :
                      <strong className="adminProfileBasicDetails">
                        {employeeData?.["dob"]}
                      </strong>
                    </p>
                    <p>
                      Phone No :
                      <strong className="adminProfileBasicDetails">
                        {employeeData?.["phone_number"]}
                      </strong>
                    </p>
                    <p>
                      Address:
                      <strong className="adminProfileBasicDetails">
                        {employeeData?.["address"]}
                      </strong>
                    </p>
                    <p>
                      Bio :
                      <strong className="adminProfileBasicDetails">
                        {employeeData?.["bio"]}
                      </strong>
                    </p>
                    <p>
                      Gender :
                      <strong className="adminProfileBasicDetails">
                        {employeeData?.["gender"]}
                      </strong>
                    </p>
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
          </div>
        </div>

        <div className="profilecol2">
          <div className="adminProfile"
           
          >
            <Card style={{ width: "30rem" }} className="mb-2">
              <Card.Header><h4>Employee Documents</h4></Card.Header>
              <Card.Body>
                <Card.Text>
                  <div>
                    <p>
                      Pan Card No :
                      <strong>
                        {documentsData && documentsData["pan_card"]}
                      </strong>
                    </p>
                    <p>
                      Aadhar Card No :
                      <strong>
                        {documentsData && documentsData["aadhar_card"]}
                      </strong>
                    </p>
                    <p>
                      Pan Image :
                      <strong>
                        {documentsData && (
                          <Link
                            to={`http://127.0.0.1:8000/media/${documentsData["pan_image"]}`}
                          >
                            {documentsData["pan_image"]}
                          </Link>
                        )}
                      </strong>
                    </p>
                    <p>
                      Aadhar Image :
                      <strong>
                        {documentsData && (
                          <Link
                            to={`http://127.0.0.1:8000/media/${documentsData["aadhar_image"]}`}
                          >
                            {documentsData["aadhar_image"]}
                          </Link>
                        )}
                      </strong>
                    </p>
                  </div>
                </Card.Text>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Upload Profile Image</Modal.Title>
          <Modal.Body>
            <Formik
              initialValues={{
                profile: "",
              }}
              onSubmit={handleProfilePicSubmit}
            >
              {({
                values,
                setFieldValue,
                handleChange,
                handleBlur,
                isSubmitting,
                errors,
                touched,
              }) => (
                <Form>
                  {errors.api && <p className="text-danger">{errors.api}</p>}
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    name="profile"
                    onChange={(event : any) => {
                      setFieldValue("profile", event.currentTarget.files[0]);
                    }}
                    onBlur={handleBlur}
                    className={
                      touched.profile && errors.profile ? "is-invalid" : ""
                    }
                  />
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Submit
                  </Button>
                </Form>
              )}
            </Formik>
          </Modal.Body>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="dashBoardrow">
        <div className="dashBoardcol3" style={{ marginLeft: `280px` }}>
          <Card style={{ width: "30rem" }}>
            <Card.Header><h4>Employee Relations</h4></Card.Header>
            <Card.Body>
              <Card.Text>
                <div>
                  <p>
                    Designation :
                    <strong>
                      {relationsData && relationsData["designation"]}
                    </strong>
                  </p>
                  <p>
                    Department :
                    <strong>
                      {relationsData && relationsData["department"]}
                    </strong>
                  </p>
                  <p>
                    Batch :
                    <strong>{relationsData && relationsData["batch"]}</strong>
                  </p>
                  <p>
                    Joining Date :
                    <strong>
                      {relationsData && relationsData["joining_date"]}
                    </strong>
                  </p>
                  <p>
                    Probabation End Date :
                    <strong>
                      {relationsData && relationsData["probation_end_date"]}
                    </strong>
                  </p>
                  <p>
                    Work Duration :
                    <strong>
                      {relationsData && relationsData["work_duration"]}
                    </strong>
                  </p>
                </div>
              </Card.Text>
              <div className="editButton">
                <Link to="/profile/edit">
                  <Button>Edit Profile</Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </div>
        <div className="dashBoardcol4">
          <Card style={{ width: "20rem" }}>
            <Card.Body>
              <Card.Title>Profile Image</Card.Title>
              <img
                id="profileImage"
                src={employeeData?.["profile"]}
                alt="Profile Image"
              />
              <Card.Text></Card.Text>
              <Button variant="primary" onClick={handleShow}>
                Update Profile Picture
              </Button>
            </Card.Body>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Profile;
