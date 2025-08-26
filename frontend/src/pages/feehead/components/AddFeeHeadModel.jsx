import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { RxCross1 } from 'react-icons/rx';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import CONSTANTS from '../../../constants.json';
import { addFeeHead, fetchFeeHeadList } from '../../../redux/apis/feehead'; // adjust import path if needed

const AddFeeHeadModal = ({
  feeHeadId = undefined,
  closeModal,
  setRecallApi,
  recallApi,
}) => {
  const dispatch = useDispatch();

  const initialValues = {
    name: '',
    amount: '',
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, 'Must be at least 2 characters')
      .max(100, 'Cannot exceed 100 characters')
      .required('Fee Head Name is required'),
    amount: Yup.number()
      .typeError('Amount must be a number')
      .positive('Amount must be positive')
      .required('Amount is required'),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    const payload = {
      name: values.name.trim(),
      amount: parseFloat(values.amount),
    };

    if (feeHeadId) payload.feeHeadId = feeHeadId;

    const action = feeHeadId ? updateFeeHead : addFeeHead;

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
      <div className="m-4 bg-white p-6 rounded-lg shadow-lg w-[300px] sm:w-[400px] md:w-[500px] relative">
        <button
          className="text-gray-500 hover:text-gray-800 absolute top-3 right-3 text-lg"
          onClick={closeModal}
        >
          <RxCross1 />
        </button>
        <h3 className="mt-4 mb-6 text-gray-600 font-semibold text-center uppercase">
          {feeHeadId ? 'EDIT FEE HEAD' : 'ADD FEE HEAD'}
        </h3>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="space-y-4">
                {/* Fee Head Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    <span style={{ color: 'red' }}>* </span>Name
                  </label>
                  <Field
                    name="name"
                    className="custom-input"
                    placeholder="Enter fee head name"
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

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    <span style={{ color: 'red' }}>* </span>Amount
                  </label>
                  <Field
                    name="amount"
                    className="custom-input"
                    placeholder="Enter amount"
                    type="number"
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9.]/g, '');
                    }}
                  />
                  <ErrorMessage
                    name="amount"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>
              </div>

              <div className="flex gap-5 justify-center w-full pt-6">
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 w-1/3"
                  onClick={closeModal}
                  type="button"
                >
                  {CONSTANTS.BUTTON.BACK}
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-1/3"
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

export default AddFeeHeadModal;
