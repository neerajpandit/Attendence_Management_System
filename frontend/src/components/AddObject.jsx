import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { RxCross1 } from 'react-icons/rx';
import toast from 'react-hot-toast';
import CONSTANTS from '../constants.json';
import { useDispatch } from 'react-redux';
import { newObject } from '../redux/apis/object';

const AddObject = ({ closeModal, type, parentId, recallApi, setRecallApi }) => {
  const dispatch = useDispatch();

  const validationSchema = Yup.object({
    name: Yup.string()
      .trim()
      .min(2, 'Name must be at least 2 characters')
      .max(150, 'Name cannot exceed 150 characters')
      .required('Name is required'),
    chargeType: Yup.lazy(() => {
      if (type === 'additional charge' || type === 'one time charge') {
        return Yup.mixed()
          .oneOf(['0', '1'], 'Charge type must be either fixed or area based')
          .required('Charge type is required');
      }
      return Yup.mixed().notRequired();
    }),
    refundType: Yup.lazy(() => {
      if (type === 'one time charge') {
        return Yup.mixed()
          .oneOf(['0', '1'], 'Refund type must be refundable or non-refundable')
          .required('Refund type is required for one-time charges');
      }
      return Yup.mixed().notRequired();
    }),
    areaType: Yup.lazy((_, context) => {
      const chargeType = context?.parent?.chargeType;
      if (type === 'additional charge' && chargeType === '1') {
        return Yup.string()
          .oneOf(['0', '1'], 'Select a valid area type')
          .required('Area type is required');
      }
      return Yup.mixed().notRequired();
    }),
  });

  const initialValues = {
    name: '',
    chargeType: '',
    refundType: '',
    areaType: '',
    hsnCode: '',
    type: type,
  };

  const handleSubmit = (values, { setSubmitting }) => {
    const payload = {};

    if (values.type === 'property type') {
      payload.propertyName = values.name;
      payload.type = 'property-type';
    }

    if (values.type === 'additional charge') {
      payload.chargeName = values.name;
      payload.type = 'additional-charge';
      payload.chargeType = values.chargeType;
      if (values.chargeType === '1') {
        payload.areaType = values.areaType;
      }
      if (values.hsnCode) {
        payload.hsnCode = values.hsnCode;
      }
    }

    if (values.type === 'one time charge') {
      payload.chargeName = values.name;
      payload.type = 'one-time-charge';
      payload.chargeType = values.chargeType;
      payload.refundType = values.refundType;
    }

    dispatch(newObject(payload)).then((res) => {
      if (res.success) {
        toast.success(res.message);
        setRecallApi(!recallApi);
        closeModal();
      } else {
        toast.error(res.message);
      }
      setSubmitting(false);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="m-4 bg-white p-6 rounded-lg shadow-lg w-[300px] sm:w-[350px] md:w-[380px] lg:w-[400px] text-center relative">
        <button
          className="text-gray-500 hover:text-gray-800 absolute top-3 right-3 text-lg"
          onClick={closeModal}
          aria-label="Close modal"
        >
          <RxCross1 />
        </button>
        <h3 className="mt-4 mb-6 text-gray-600 font-semibold uppercase">
          ADD {type.toUpperCase()}
        </h3>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            isSubmitting,
            touched,
            values,
            setFieldValue,
            setFieldTouched,
          }) => {
            // useEffect to reset areaType when chargeType is '0' (fixed)
            useEffect(() => {
              if (values.chargeType === '0' && values.areaType !== '') {
                setFieldValue('areaType', '');
              }
            }, [values.chargeType, setFieldValue, values.areaType]);

            return (
              <Form>
                {/* Name Field */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-left text-sm font-medium leading-6 text-gray-700 capitalize"
                  >
                    <span style={{ color: 'red' }}>*</span> {type}{' '}
                    {CONSTANTS.LABEL.NAME}
                  </label>
                  <Field
                    type="text"
                    name="name"
                    className="custom-input"
                    placeholder="Enter name"
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/\s+/g, ' ');
                    }}
                    onFocus={() => setFieldTouched('name', true, true)}
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-xs text-red-500 text-left mt-1"
                  />
                </div>

                {/* HSN Code Field (Only for additional charge) */}
                {type === 'additional charge' && (
                  <div className="mt-3">
                    <label
                      htmlFor="hsnCode"
                      className="block text-left text-sm font-medium leading-6 text-gray-700 capitalize"
                    >
                      HSN Code
                    </label>
                    <Field
                      name="hsnCode"
                      className="custom-input"
                      placeholder="Enter HSN Code"
                      onInput={(e) => {
                        const val = e.target.value
                          .toUpperCase()
                          .replace(/\s+/g, '');
                        setFieldValue('hsnCode', val);
                      }}
                    />
                  </div>
                )}

                {/* Charge Type */}
                {(type === 'additional charge' ||
                  type === 'one time charge') && (
                  <div className="mt-3">
                    <label
                      htmlFor="chargeType"
                      className="block text-left text-sm font-medium leading-6 text-gray-700 capitalize"
                    >
                      <span style={{ color: 'red' }}>*</span> {type}{' '}
                      {CONSTANTS.LABEL.CHARGE_TYPE}
                    </label>
                    <Field
                      as="select"
                      name="chargeType"
                      className="custom-input"
                    >
                      <option value="" disabled label="Select Charge Type" />
                      <option value="0" label="Fixed Charge" />
                      <option value="1" label="Area Based Charge" />
                    </Field>
                    <ErrorMessage
                      name="chargeType"
                      component="div"
                      className="text-red-500 text-xs text-left mt-1"
                    />
                  </div>
                )}

                {/* Area Type (Only for additional charge and when chargeType is Area Based) */}
                {type === 'additional charge' && values.chargeType === '1' && (
                  <div className="mt-3">
                    <label
                      htmlFor="areaType"
                      className="block text-left text-sm font-medium leading-6 text-gray-700 capitalize"
                    >
                      <span style={{ color: 'red' }}>*</span> Area Type
                    </label>
                    <Field as="select" name="areaType" className="custom-input">
                      <option value="" disabled label="Select Area Type" />
                      <option value="0" label="Unit Area" />
                      <option value="1" label="Other Area" />
                    </Field>
                    <ErrorMessage
                      name="areaType"
                      component="div"
                      className="text-red-500 text-xs text-left mt-1"
                    />
                  </div>
                )}

                {/* Refund Type */}
                {type === 'one time charge' && (
                  <div className="mt-3">
                    <label
                      htmlFor="refundType"
                      className="block text-left text-sm font-medium leading-6 text-gray-700 capitalize"
                    >
                      <span style={{ color: 'red' }}>*</span> {type}{' '}
                      {CONSTANTS.LABEL.REFUND_TYPE}
                    </label>
                    <Field
                      as="select"
                      name="refundType"
                      className="custom-input"
                    >
                      <option value="" disabled label="Select Refund Type" />
                      <option value="0" label="Refundable" />
                      <option value="1" label="Non Refundable" />
                    </Field>
                    <ErrorMessage
                      name="refundType"
                      component="div"
                      className="text-red-500 text-xs text-left mt-1"
                    />
                  </div>
                )}

                {/* Buttons */}
                <div className="flex gap-5 justify-between w-full mt-8">
                  <div className="flex-1">
                    <button
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 w-full"
                      onClick={closeModal}
                      type="button"
                    >
                      {CONSTANTS.BUTTON.BACK}
                    </button>
                  </div>
                  <div className="flex-1">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-full"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Saving...' : CONSTANTS.BUTTON.SAVE}
                    </button>
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default AddObject;
