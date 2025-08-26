import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { RxCross1 } from 'react-icons/rx';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import CONSTANTS from '../../../constants.json';
import { addPlan } from '../../../redux/apis/plan'; // <-- update with correct API

const AddPlanModal = ({
  planId = undefined,
  closeModal,
  setRecallApi,
  recallApi,
}) => {
  const initialValues = {
    name: '',
    durationDays: '',
    price: '',
    features: '',
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, 'Must be at least 3 characters')
      .max(100, 'Cannot exceed 100 characters')
      .required('Plan name is required'),
    durationDays: Yup.number()
      .min(1, 'Must be at least 1 day')
      .required('Duration is required'),
    price: Yup.number()
      .min(0, 'Price cannot be negative')
      .required('Price is required'),
    features: Yup.string().required('At least one feature is required'),
  });

  const dispatch = useDispatch();

  const handleSubmit = (values, { setSubmitting }) => {
    const payload = {
      name: values.name,
      durationDays: values.durationDays,
      price: values.price,
      features: values.features
        .split(',')
        .map((f) => f.trim())
        .filter((f) => f !== ''),
    };

    if (planId) payload.planId = planId;

    const action = planId ? updatePlan : addPlan;

    dispatch(action(payload)).then((res) => {
      
      if (res.statusCode === 201) {
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
      <div className="m-4 bg-white p-6 rounded-lg shadow-lg w-[300px] sm:w-[400px] md:w-[500px] lg:w-[600px] relative">
        <button
          className="text-gray-500 hover:text-gray-800 absolute top-3 right-3 text-lg"
          onClick={closeModal}
        >
          <RxCross1 />
        </button>
        <h3 className="mt-4 mb-6 text-gray-600 font-semibold text-center uppercase">
          {planId ? 'EDIT PLAN' : 'ADD PLAN'}
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
                  Plan Details:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      <span style={{ color: 'red' }}>* </span>Plan Name
                    </label>
                    <Field
                      name="name"
                      className="custom-input"
                      placeholder="Enter plan name"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500 text-xs"
                    />
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      <span style={{ color: 'red' }}>* </span>Duration (Days)
                    </label>
                    <Field
                      name="durationDays"
                      type="number"
                      className="custom-input"
                      placeholder="Enter duration in days"
                    />
                    <ErrorMessage
                      name="durationDays"
                      component="div"
                      className="text-red-500 text-xs"
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      <span style={{ color: 'red' }}>* </span>Price
                    </label>
                    <Field
                      name="price"
                      type="number"
                      className="custom-input"
                      placeholder="Enter plan price"
                    />
                    <ErrorMessage
                      name="price"
                      component="div"
                      className="text-red-500 text-xs"
                    />
                  </div>

                  {/* Features */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      <span style={{ color: 'red' }}>* </span>Features
                    </label>
                    <Field
                      name="features"
                      className="custom-input"
                      placeholder="Enter features separated by commas"
                    />
                    <ErrorMessage
                      name="features"
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

export default AddPlanModal;
