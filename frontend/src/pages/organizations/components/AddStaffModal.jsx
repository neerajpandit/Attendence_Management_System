// import React from 'react';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
// import { RxCross1 } from 'react-icons/rx';
// import toast from 'react-hot-toast';
// import { useDispatch,useSelector } from 'react-redux';

// import CONSTANTS from '../../../constants.json';
// import {
//   addOrganization
// } from '../../../redux/apis/organization';


// const AddOrganizationModal = ({
//   organizationId = undefined,
//   closeModal,
//   setRecallApi,
//   recallApi,
// }) => {
//   const initialValues = {
//     fullName: '',
//     email: '',
//     password: '',
//     role: '2', // default role
//     businessId: '',
//   };
// const { businessId } = useSelector((state) => state.userDetailsSlice.details);
// console.log('profileId', businessId);
//   const validationSchema = Yup.object({
//     fullName: Yup.string()
//       .min(3, 'Must be at least 3 characters')
//       .max(100, 'Cannot exceed 100 characters')
//       .required('Full name is required'),
//     email: Yup.string()
//       .email('Invalid email address')
//       .required('Email is required'),
//     password: Yup.string()
//       .min(6, 'Password must be at least 6 characters')
//       .required('Password is required'),
//     role: Yup.string().required('Role is required'),
//   });

//   const dispatch = useDispatch();

//   const handleSubmit = (values, { setSubmitting }) => {
//     const payload = {
//       email: values.email,
//       password: values.password,
//       role: values.role,
//       fullName: values.fullName,
//     };

//     if (organizationId) payload.organizationId = organizationId;

//     console.log('payload', payload);

//     const action = organizationId ? updateOrganization : addOrganization;

//     dispatch(action(payload)).then((res) => {
//       if (res.success) {
//         toast.success(res.message);
//         setRecallApi((prev) => !prev);
//         closeModal();
//       } else {
//         toast.error(res.message);
//       }
//       setSubmitting(false);
//     });
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//       <div className="m-4 bg-white p-6 rounded-lg shadow-lg w-[300px] sm:w-[400px] md:w-[500px] lg:w-[600px] relative">
//         <button
//           className="text-gray-500 hover:text-gray-800 absolute top-3 right-3 text-lg"
//           onClick={closeModal}
//         >
//           <RxCross1 />
//         </button>
//         <h3 className="mt-4 mb-6 text-gray-600 font-semibold text-center uppercase">
//           {organizationId ? 'EDIT ORGANIZATION' : 'ADD ORGANIZATION'}
//         </h3>
//         <Formik
//           initialValues={initialValues}
//           validationSchema={validationSchema}
//           enableReinitialize
//           onSubmit={handleSubmit}
//         >
//           {({ isSubmitting }) => (
//             <Form>
//               <div className="overflow-y-auto custom-scrollbar max-h-[60vh] py-2">
//                 <div className="font-semibold text-blue-500 text-xs pb-1 uppercase">
//                   Organization Details:
//                 </div>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
//                   {/* Full Name */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">
//                       <span style={{ color: 'red' }}>* </span>Full Name
//                     </label>
//                     <Field
//                       name="fullName"
//                       className="custom-input"
//                       placeholder="Enter full name"
//                     />
//                     <ErrorMessage
//                       name="fullName"
//                       component="div"
//                       className="text-red-500 text-xs"
//                     />
//                   </div>

//                   {/* Email */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">
//                       <span style={{ color: 'red' }}>* </span>Email
//                     </label>
//                     <Field
//                       name="email"
//                       type="email"
//                       className="custom-input"
//                       placeholder="Enter email"
//                     />
//                     <ErrorMessage
//                       name="email"
//                       component="div"
//                       className="text-red-500 text-xs"
//                     />
//                   </div>

//                   {/* Password */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">
//                       <span style={{ color: 'red' }}>* </span>Password
//                     </label>
//                     <Field
//                       name="password"
//                       type="password"
//                       className="custom-input"
//                       placeholder="Enter password"
//                     />
//                     <ErrorMessage
//                       name="password"
//                       component="div"
//                       className="text-red-500 text-xs"
//                     />
//                   </div>

//                   {/* Role */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">
//                       <span style={{ color: 'red' }}>* </span>Role
//                     </label>
//                     <Field as="select" name="role" className="custom-input">
//                       <option value="2"> Staff Role</option>
//                     </Field>
//                     <ErrorMessage
//                       name="role"
//                       component="div"
//                       className="text-red-500 text-xs"
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="flex gap-5 justify-center w-full pt-2">
//                 <button
//                   className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 w-1/4"
//                   onClick={closeModal}
//                   type="button"
//                 >
//                   {CONSTANTS.BUTTON.BACK}
//                 </button>
//                 <button
//                   className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-1/4"
//                   type="submit"
//                   disabled={isSubmitting}
//                 >
//                   {isSubmitting ? 'Saving...' : CONSTANTS.BUTTON.SAVE}
//                 </button>
//               </div>
//             </Form>
//           )}
//         </Formik>
//       </div>
//     </div>
//   );
// };

// export default AddOrganizationModal;

import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { RxCross1 } from 'react-icons/rx';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

import CONSTANTS from '../../../constants.json';
import {
  
  addStaff, // Assuming you're using this to add staff
} from '../../../redux/apis/organization';

const AddStaffModal = ({
  organizationId = undefined,
  closeModal,
  setRecallApi,
  recallApi,
}) => {
  const dispatch = useDispatch();

  // Get businessId from userDetailsSlice
  const { businessId } = useSelector((state) => state.userDetailsSlice.details);
  console.log('businessId', businessId);

  const initialValues = {
    fullName: '',
    email: '',
    password: '',
    role: '2', // default staff role
    businessId: '', // not shown in UI but sent in payload
  };

  const validationSchema = Yup.object({
    fullName: Yup.string()
      .min(3, 'Must be at least 3 characters')
      .max(100, 'Cannot exceed 100 characters')
      .required('Full name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    role: Yup.string().required('Role is required'),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    const payload = {
      email: values.email,
      password: values.password,
      role: values.role,
      fullName: values.fullName,
      businessId, // Add businessId here
    };

    if (organizationId) payload.organizationId = organizationId;

    console.log('payload', payload);

    const action = organizationId ? updateOrganization : addStaff;

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
      <div className="m-4 bg-white p-6 rounded-lg shadow-lg w-[300px] sm:w-[400px] md:w-[500px] lg:w-[600px] relative">
        <button
          className="text-gray-500 hover:text-gray-800 absolute top-3 right-3 text-lg"
          onClick={closeModal}
        >
          <RxCross1 />
        </button>
        <h3 className="mt-4 mb-6 text-gray-600 font-semibold text-center uppercase">
          {organizationId ? 'EDIT STAFF' : 'ADD STAFF'}
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
                  Staff Details:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      <span style={{ color: 'red' }}>* </span>Full Name
                    </label>
                    <Field
                      name="fullName"
                      className="custom-input"
                      placeholder="Enter full name"
                    />
                    <ErrorMessage
                      name="fullName"
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

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      <span style={{ color: 'red' }}>* </span>Password
                    </label>
                    <Field
                      name="password"
                      type="password"
                      className="custom-input"
                      placeholder="Enter password"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 text-xs"
                    />
                  </div>

                  {/* Role */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      <span style={{ color: 'red' }}>* </span>Role
                    </label>
                    <Field as="select" name="role" className="custom-input">
                      <option value="2">Staff Role</option>
                    </Field>
                    <ErrorMessage
                      name="role"
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

export default AddStaffModal;
