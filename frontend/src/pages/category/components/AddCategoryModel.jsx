import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { RxCross1 } from 'react-icons/rx';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import CONSTANTS from '../../../constants.json';
import { addCategory } from '../../../redux/apis/category'; // Make sure this is correct

const AddCategoryModal = ({
  closeModal,
  setRecallApi,
  recallApi,
  categoryId = undefined,
}) => {
  const dispatch = useDispatch();

  const initialValues = {
    name: '',
    category_code: '',
    description: '',
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, 'Must be at least 3 characters')
      .max(100, 'Cannot exceed 100 characters')
      .required('Category Name is required'),
    category_code: Yup.string()
      .matches(/^[a-zA-Z0-9]+$/, 'Code must be alphanumeric with no spaces')
      .max(10, 'Cannot exceed 10 characters')
      .required('Category Code is required'),
    description: Yup.string()
      .max(300, 'Cannot exceed 300 characters')
      .required('Description is required'),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    const payload = {
      name: values.name,
      category_code: values.category_code,
      description: values.description,
    };

    if (categoryId) payload.categoryId = categoryId;

    dispatch(addCategory(payload)).then((res) => {
      if (res.success) {
        toast.success(res.message || 'Category saved successfully');
        setRecallApi((prev) => !prev);
        closeModal();
      } else {
        toast.error(res.message || 'Something went wrong');
      }
      setSubmitting(false);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="m-4 bg-white p-6 rounded-lg shadow-lg w-[300px] sm:w-[400px] md:w-[500px] lg:w-[700px] relative">
        <button
          className="text-gray-500 hover:text-gray-800 absolute top-3 right-3 text-lg"
          onClick={closeModal}
        >
          <RxCross1 />
        </button>
        <h3 className="mt-4 mb-6 text-gray-600 font-semibold text-center uppercase">
          {categoryId ? 'EDIT CATEGORY' : 'ADD CATEGORY'}
        </h3>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="overflow-y-auto custom-scrollbar max-h-[60vh] py-2">
                <div className="font-semibold text-blue-500 text-xs pb-1 uppercase">
                  Category Details:
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {/* Category Name */}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      <span style={{ color: 'red' }}>* </span>Category Name
                    </label>
                    <Field
                      name="name"
                      className="custom-input"
                      placeholder="Enter category name"
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

                  {/* Category Code */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      <span style={{ color: 'red' }}>* </span>Category Code
                    </label>
                    <Field
                      name="category_code"
                      className="custom-input"
                      placeholder="Enter category code"
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(
                          /[^a-zA-Z0-9]/g,
                          ''
                        );
                      }}
                    />
                    <ErrorMessage
                      name="category_code"
                      component="div"
                      className="text-red-500 text-xs"
                    />
                  </div>

                  {/* Description */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      <span style={{ color: 'red' }}>* </span>Description
                    </label>
                    <Field
                      name="description"
                      as="textarea"
                      rows="4"
                      className="custom-input resize-none"
                      placeholder="Enter description"
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="text-red-500 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Buttons */}
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

export default AddCategoryModal;
