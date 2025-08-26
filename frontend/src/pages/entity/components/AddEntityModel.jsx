import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { RxCross1 } from 'react-icons/rx';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import CONSTANTS from '../../../constants.json';
import { addEntity, updateEntity } from '../../../redux/apis/entity';

const AddEntityModal = ({
  entityId = undefined,
  closeModal,
  setRecallApi,
  recallApi,
}) => {
  const initialValues = {
    name: '',
    email: '',
    phone: '',
    max_institute_limit: '',
    subdomain: '',
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, 'Must be at least 3 characters')
      .max(100, 'Cannot exceed 100 characters')
      .required('Entity Name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
      .required('Phone number is required'),
    max_institute_limit: Yup.number()
      .min(1, 'Must be at least 1')
      .required('Max institute limit is required'),
    subdomain: Yup.string()
      .matches(
        /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}$/,
        'Invalid subdomain format (e.g., entity2.innobles.com)'
      )
      .required('Subdomain is required'),
  });

  const dispatch = useDispatch();

  const handleSubmit = (values, { setSubmitting }) => {
    const payload = {
      name: values.name,
      email: values.email,
      phone: values.phone,
      max_institute_limit: values.max_institute_limit,
      subdomain: values.subdomain,
    };

    if (entityId) payload.entityId = entityId;

    console.log('payload', payload);

    const action = entityId ? updateEntity : addEntity;

    dispatch(action(payload)).then((res) => {
      if (res.success) {
        toast.success(res.message);
        setRecallApi((prev) => !prev);
        closeModal();
      } else {
        toast.error(res.message);
      }
      setSubmitting(false);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="m-4 bg-white p-6 rounded-lg shadow-lg w-[300px] sm:w-[400px] md:w-[500px] lg:w-[850px] relative">
        <button
          className="text-gray-500 hover:text-gray-800 absolute top-3 right-3 text-lg"
          onClick={closeModal}
        >
          <RxCross1 />
        </button>
        <h3 className="mt-4 mb-6 text-gray-600 font-semibold text-center uppercase">
          {entityId ? 'EDIT ENTITY' : 'ADD ENTITY'}
        </h3>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="overflow-y-auto custom-scrollbar max-h-[60vh] py-2">
                <div className="font-semibold text-blue-500 text-xs pb-1 uppercase">
                  Entity Details:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                  {/* Entity Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      <span style={{ color: 'red' }}>* </span>Entity Name
                    </label>
                    <Field
                      name="name"
                      className="custom-input"
                      placeholder="Enter entity name"
                      onInput={(e) => {
                        e.target.value = e.target.value
                          .replace(/\s+/g, ' ')
                          .trimStart();
                      }}
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500 text-xs"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      <span style={{ color: 'red' }}>* </span>Email
                    </label>
                    <Field
                      name="email"
                      type="email"
                      className="custom-input"
                      placeholder="Enter email"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-xs"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      <span style={{ color: 'red' }}>* </span>Phone Number
                    </label>
                    <Field
                      name="phone"
                      className="custom-input"
                      placeholder="Enter 10-digit phone number"
                      onInput={(e) => {
                        e.target.value = e.target.value
                          .replace(/[^0-9]/g, '')
                          .slice(0, 10);
                      }}
                    />
                    <ErrorMessage
                      name="phone"
                      component="div"
                      className="text-red-500 text-xs"
                    />
                  </div>

                  {/* Max Institute Limit */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      <span style={{ color: 'red' }}>* </span>Max Institute
                      Limit
                    </label>
                    <Field
                      name="max_institute_limit"
                      type="number"
                      className="custom-input"
                      placeholder="Enter max institute limit"
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9]/g, '');
                      }}
                    />
                    <ErrorMessage
                      name="max_institute_limit"
                      component="div"
                      className="text-red-500 text-xs"
                    />
                  </div>

                  {/* Subdomain */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      <span style={{ color: 'red' }}>* </span>Subdomain
                    </label>
                    <Field
                      name="subdomain"
                      className="custom-input"
                      placeholder="e.g., entity2.innobles.com"
                    />
                    <ErrorMessage
                      name="subdomain"
                      component="div"
                      className="text-red-500 text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-5 justify-center w-full pt-2">
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 w-1/4"
                  onClick={closeModal}
                  type="button"
                >
                  {CONSTANTS.BUTTON.BACK}
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-1/4"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : CONSTANTS.BUTTON.SAVE}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div> 
    </div>
  );
};

export default AddEntityModal;
