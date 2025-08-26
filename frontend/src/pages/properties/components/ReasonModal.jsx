import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { RxCross1 } from 'react-icons/rx';
import { FaUpload } from 'react-icons/fa';

const ReasonModal = ({ open, type, onCancel, onSubmit, loading = false }) => {
  const [documentName, setDocumentName] = useState('');

  if (!open) return null;

  const initialValues = {
    reason: '',
    attachment: null,
  };

  const validationSchema = Yup.object({
    reason: Yup.string()
      .required('Reason is required')
      .min(3, 'Reason must be at least 3 characters'),
    attachment: Yup.mixed()
      .required('Supported document is required')
      .test(
        'fileType',
        'Only PDF files are allowed',
        (value) => value && value.type === 'application/pdf'
      )
      .test(
        'fileSize',
        'File size must be less than 5MB',
        (value) => value && value.size <= 5 * 1024 * 1024
      ),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="m-4 bg-white p-6 rounded-lg shadow-lg w-[420px] relative">
        <button
          className="text-gray-500 hover:text-gray-800 absolute top-3 right-3 text-lg"
          onClick={onCancel}
          type="button"
        >
          <RxCross1 />
        </button>
        <h3 className="mt-4 mb-6 text-gray-600 font-semibold text-center uppercase">
          {type === 'courtCase' ? 'Mark as Court Case' : 'Mark as Defaulter'}
        </h3>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, actions) => {
            onSubmit(values);
            actions.setSubmitting(false);
            setDocumentName('');
          }}
        >
          {({ setFieldValue, isSubmitting, isValid }) => (
            <Form>
              <div className="overflow-y-auto custom-scrollbar max-h-[50vh] py-2">
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="textarea"
                    name="reason"
                    rows={4}
                    className="custom-input py-2"
                    placeholder="Enter reason here..."
                  />
                  <ErrorMessage
                    name="reason"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Supported Document <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center border border-secondary rounded-lg py-1 px-5 focus-within:ring-2 focus-within:ring-primary">
                    <FaUpload className="text-gray-500 text-lg mr-3 flex-shrink-0" />
                    <label
                      className="text-sm text-gray-700 cursor-pointer flex-grow"
                      htmlFor="attachment"
                    >
                      <span className="max-h-20 overflow-auto text-ellipsis break-all block custom-scrollbar py-2">
                        {documentName || 'Choose PDF Document'}
                      </span>
                    </label>
                    <input
                      type="file"
                      id="attachment"
                      name="attachment"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(event) => {
                        const file = event.currentTarget.files[0];
                        setDocumentName(file ? file.name : '');
                        setFieldValue('attachment', file);
                      }}
                    />
                  </div>
                  <ErrorMessage
                    name="attachment"
                    component="div"
                    className="text-xs text-red-500 text-left mt-1"
                  />
                </div>
              </div>
              <div className="flex gap-5 justify-center w-full pt-2">
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 w-1/3"
                  onClick={onCancel}
                  type="button"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-1/3"
                  type="submit"
                  disabled={isSubmitting || !isValid}
                >
                  {isSubmitting || loading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ReasonModal;
