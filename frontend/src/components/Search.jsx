import React from 'react';
import { Formik, Form, Field } from 'formik';

const Search = ({ searchInput, onSearch, placeHolder }) => {
  return (
    <Formik
      initialValues={{ search: searchInput }}
      enableReinitialize
      validate={(values) => {
        const errors = {};
        if (!values.search) {
          errors.search = 'Required';
        }
        return errors;
      }}
      onSubmit={(values, { setSubmitting }) => {
        onSearch(values.search);
        setSubmitting(false);
      }}
    >
      {({ values, isSubmitting }) => (
        <Form className="flex items-center space-x-4 p-4 bg-gray-100 rounded-md shadow-sm">
          <Field
            type="text"
            name="search"
            placeholder={`${placeHolder}`}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
            onInput={(e) => {
              e.target.value = e.target.value.replace(/\s+/g, ' ');
            }}
          />
          <button
            type="submit"
            disabled={!values.search || isSubmitting}
            className={`px-6 py-2 font-semibold text-white rounded-md ${
              !values.search || isSubmitting
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isSubmitting ? 'Searching...' : 'Search'}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default Search;
