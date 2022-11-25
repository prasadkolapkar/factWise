import moment from 'moment';
import React, { useEffect, useState, useRef } from 'react';
import { Button, Col, FormGroup, Input, Label, Modal, ModalFooter, ModalHeader, Row } from "reactstrap";
import { ChevronDown, ChevronUp, XCircle, CheckCircle, Edit, Trash } from 'react-feather';
import './App.css';
import { Gender, ICelebrityDetails, OnlyAplabets } from './celebrityModel';
import { Controller, useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { celebrities } from './celebrities';

const App = () => {
  const [celebritiesData, setCelebritiesData] = useState<ICelebrityDetails[]>([]);
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [selected, setSelected] = useState<number | null>(null);
  const deletionRef = useRef<ICelebrityDetails>();
  const updationRef = useRef<ICelebrityDetails>();
  const oldState = useRef<ICelebrityDetails>();
  const { register, handleSubmit, control, clearErrors, getValues, setValue, formState: { errors } } = useForm();

  const toggle = (i: number, row_data: ICelebrityDetails) => {
    if (selected === i) {
      return setSelected(null)
    }
    oldState.current = row_data;
    setEditMode(false);
    setSelected(i);
    setFields(row_data);
  }

  const setFields = (row_data: any) => {
    setValue("age", moment().diff(row_data.dob, 'years', false));
    setValue("gender", row_data.gender);
    setValue("country", row_data.country);
    setValue("description", row_data.description);
    setValue("dob", row_data.dob);
  }

  const deleteEntrie = (row_data: any) => {
    const updated_data = celebritiesData.filter((a: any) => a.id != row_data.id)
    setCelebritiesData(updated_data);
    setDeleteAlert(false);
    toast(`${row_data.first} ${row_data.last} deleted successfully`)
  }

  const onSubmit = (data: any) => {
    const age = moment().diff(updationRef.current?.dob, 'years', false)
    if (age > 18) {
      const newRow = {
        id: updationRef.current?.id,
        first: updationRef.current?.first,
        last: updationRef.current?.last,
        dob: data.dob,
        gender: data.gender,
        email: updationRef.current?.email,
        picture: updationRef.current?.picture,
        country: data.country,
        description: data.description
      }
      console.log("Before updation", celebritiesData);
      const objIndex = celebritiesData.findIndex((obj => obj.id == 1));
      celebritiesData[objIndex] = newRow;
      setFields(newRow);
      setEditMode(false);
      console.log("After updation", celebritiesData);
      toast(`${updationRef.current?.first} ${updationRef.current?.last} updated successfully`);
    }
    else {
      toast(`You can not update the records as you are not adult`);
    }
  };

  useEffect(() => {
    setCelebritiesData(celebrities);
  }, [selected]);

  return (
    <React.Fragment>
      <div className='container'>
        <div className='wrapper'>
          <div className='accordion'>
            {celebritiesData.map((a: ICelebrityDetails, i) => (
              <div className='item'>
                <div className='title' onClick={() => toggle(i, a)}>
                  <div className='header'>
                    <img className="avatar" src={a.picture} />
                    <h2>{`${a.first} ${a.last}`}</h2>
                  </div>
                  <div className='arrowIcon'>
                    <span>{selected === i ?
                      <ChevronUp></ChevronUp> : <ChevronDown></ChevronDown>}</span>
                  </div>
                </div>
                <div className={selected === i ? 'content-show' : 'content'}>
                  <form id="addData" onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                      <Col sm={12}>
                        <FormGroup row>
                          {
                            !!editMode ?
                              <>
                                <Col sm={4}>
                                  <Label>Date Of Birth</Label>
                                  <Controller
                                    control={control}
                                    {...register("dob")}
                                    name="dob"
                                    rules={{ required: "Please Enter Date Of Birth" }}
                                    render={({ field }) => <Input type="date" {...field}
                                      onChange={(e) => {
                                        setValue("dob", e.target.value)
                                        clearErrors("dob");
                                      }}
                                      disabled={!editMode} />}
                                  />
                                  {errors.dob && errors.dob.type === "required" && <span className='error-msg'>Please enter dob</span>}
                                </Col>
                              </> :
                              <Col sm={4}>
                                <Label>Age</Label>
                                <Controller
                                  control={control}
                                  {...register("age")}
                                  name="age"
                                  rules={{ required: "Please Enter Date Of Birth" }}
                                  render={({ field }) => <Input {...field}
                                    onChange={(e) => {
                                      setValue("age", e.target.value)
                                      clearErrors("age");
                                    }}
                                    disabled={!editMode} />}
                                />
                                {errors.age && errors.age.type === "required" && <span className='error-msg'>Please enter dob</span>}
                              </Col>
                          }
                          <Col sm={4}>
                            <Label>Gender</Label>
                            <Controller
                              control={control}
                              {...register("gender")}
                              name="gender"
                              rules={{ required: "Please select gender" }}
                              render={({ field }) =>
                                <Input type="select" {...field}
                                  onChange={(e) => {
                                    setValue("gender", e.target.value)
                                    clearErrors("gender");

                                  }}
                                  disabled={!editMode}
                                >
                                  <option selected value="">
                                  </option>
                                  <option value={Gender.Female}>Female</option>
                                  <option value={Gender.Male}>Male</option>
                                  <option value={Gender.Transgender}>Transgender</option>
                                </Input>
                              }
                            />
                            {errors.gender && errors.gender.type === "required" && <span className='error-msg'>Please select gender</span>}
                          </Col>
                          <Col sm={4}>
                            <Label>Country</Label>
                            <Controller
                              control={control}
                              {...register("country")}
                              name="country"
                              rules={{
                                required: "Please enter country",
                                pattern: {
                                  value: OnlyAplabets,
                                  message: "Only aplabets are allowed",
                                },
                              }}
                              render={({ field }) =>
                                <Input  {...field}
                                  onChange={(e) => {
                                    setValue("country", e.target.value)
                                    clearErrors("country");

                                  }}
                                  disabled={!editMode}
                                >
                                </Input>
                              }
                            />
                            {errors.country && errors.country.type === "required" && <span className='error-msg'>Please enter country</span>}
                            {errors.country && errors.country.type === "pattern" && <span className='error-msg'>Only alphabets are allowed </span>}
                          </Col>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={12}>
                        <FormGroup row>
                          <Col sm={12}>
                            <Label>Description</Label>
                            <Controller
                              control={control}
                              {...register("description")}
                              name="description"
                              rules={{ required: "Please Enter Date Of Birth" }}
                              render={({ field }) => <Input {...field} type="textarea"
                                onChange={(e) => {
                                  setValue("description", e.target.value)
                                  clearErrors("description");
                                }}
                                disabled={!editMode} />}
                            />
                            {errors.description && (
                              <p className="error m-0">
                                {errors.description && <span className='error-msg'>Please enter description</span>}</p>
                            )}
                          </Col>
                        </FormGroup>
                      </Col>
                    </Row>
                    <div className='view-edit-buttons'>
                      {
                        !!editMode ?
                          <>
                            <div className='cancel-icon' onClick={() => {
                              setEditMode(false);
                              setFields(oldState.current);
                              clearErrors("age");
                              clearErrors("gender");
                              clearErrors("country");
                              clearErrors("description");
                            }}><XCircle ></XCircle></div>
                            <div className='save-icon'
                              onClick={() => {
                                updationRef.current = a;
                              }}>
                              <Button
                                className='saveButton'
                                name="add"
                                type="submit"
                                form="addData"
                              >
                                <CheckCircle></CheckCircle>
                              </Button>
                            </div>
                          </>
                          :
                          <>
                            <div className='edit-icon' onClick={() =>
                              setEditMode(true)
                            }><Edit></Edit></div>

                            <div className='cancel-icon' onClick={() => {
                              deletionRef.current = a;
                              setDeleteAlert(!deleteAlert)
                            }
                            }><Trash></Trash></div>
                          </>
                      }
                    </div>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Modal
        centered
        isOpen={deleteAlert}
        toggle={() => setDeleteAlert(!deleteAlert)}
      >
        <ModalHeader toggle={() => setDeleteAlert(!deleteAlert)}>
          Are you sure do you wants to delete this record ?
        </ModalHeader>
        <ModalFooter>
          <Button
            onClick={() => deleteEntrie(deletionRef.current)}
            className="rounded-pill"
            color="primary"
          >
            Yes
          </Button>
          &nbsp;
          <Button
            outline
            className="rounded-pill"
            color="secondary"
            type="button"
            onClick={() => {
              setDeleteAlert(false)
              toast(`operation cancelled`)
            }}
          >
            No
          </Button>
        </ModalFooter>
      </Modal>
      <div>
        <ToastContainer />
      </div>
    </React.Fragment>
  );
}
export default App;
