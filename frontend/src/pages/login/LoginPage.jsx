import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchCaptcha, userLogin } from '../../redux/apis/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import toast, { Toaster } from 'react-hot-toast';
import { LuRefreshCw } from 'react-icons/lu';
import CONSTANTS from '../../constants.json';
import Underline from '../../components/Underline';
import TroubleLogin from '../../components/TroubleLogin';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [toastId, setToastId] = useState(null);
  const [resetCaptcha, setResetCaptcha] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [captcha, setCaptcha] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Validation schema with proper username regex validation
  const validationSchema = Yup.object({
    email: Yup.string().required('Email is required'),
    password: Yup.string().required('Password is required'),
    // captchaInput: Yup.string().required('Captcha is required'),
  });

  const initialValues = {
    email: '',
    password: '',
    // captchaInput: '',
  };

  const handleSubmit = (values, { setSubmitting }) => {
    dispatch(userLogin({ ...values, captchaToken: captchaToken })).then(
      (res) => {
        if (res.success) {
          if (toastId) toast.dismiss(toastId);
          navigate('/dashboard');
        } else {
          if (toastId) toast.dismiss(toastId);
          const id = toast.error(res.message);
          setToastId(id);
          setResetCaptcha(!resetCaptcha);
        }
        setSubmitting(false);
      }
    );
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  // useEffect(() => {
  //   fetchCaptcha().then((res) => {
  //     if (res.success) {
  //       setCaptcha(res.image);
  //       setCaptchaToken(res.captchaToken);
  //     } else {
  //       toast.error(res.message);
  //     }
  //   });
  // }, [resetCaptcha]);

  return (
    <div className="w-full h-screen overflow-y-auto hide-scrollbar flex justify-center items-center relative">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="/paymentC.webp"
          alt="Background"
          className="w-full h-full object-cover object-center opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/30 via-blue-900/20 to-slate-800/30" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-400 opacity-30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-violet-500 opacity-20 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Triangle background image */}
      <div className="hidden h-full absolute left-0 top-0 z-0">
        <div
          className="w-full h-full"
          style={{
            clipPath: 'polygon(0 0, 85% 0, 100% 100%, 0% 100%)',
            WebkitClipPath: 'polygon(0 0, 85% 0, 100% 100%, 0% 100%)',
          }}
        >
          <img
            src="/paymentC.webp"
            alt="Background"
            className="w-full h-full object-cover object-center"
          />
        </div>
      </div>
      <div className="flex flex-col justify-center items-center z-10 w-full h-full sm:w-1/2 sm:h-auto">
        <div className="relative z-10 flex flex-row justify-center items-center gap-1 p-3 m-1">
          <div className="">
            {/* <img
              src=""
              alt=""
              width="108"
              className="rounded-lg"
            /> */}
          </div>
          <div className="text-gray-900 font-semibold text-xl max-w-xl text-center uppercase">
            {CONSTANTS.PROJECT_NAME}
          </div>
        </div>
        <div className="m-1 loginPage px-5 max-w-md rounded-xl shadow-2xl bg-white/10 backdrop-blur-lg border border-white/20 text-white text-center w-[300px] sm:w-[350px] md:w-[380px] lg:w-[380px] relative z-10">
          <h3 className="my-5 text-gray-900 font-bold uppercase">
            {CONSTANTS.PAGE.SIGN_IN}
          </h3>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, values }) => (
              <Form className="mb-5">
                <div className="mb-3">
                  <label
                    htmlFor="email"
                    className="block text-left text-sm font-medium leading-6 text-gray-900"
                  >
                    {CONSTANTS.LABEL.EMAIL}
                  </label>
                  <Field
                    type="text"
                    name="email"
                    className="custom-input bg-white/5 backdrop-blur-md  border-gray-700 focus:border-blue-500 focus:ring-blue-500 placeholder-gray-600"
                    placeholder="Enter email"
                    onKeyDown={(e) => {
                      if (e.key === ' ') {
                        e.preventDefault();
                      }
                    }}
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-xs text-rose-800 text-left"
                  />
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="password"
                    className="relative block text-left text-sm font-medium leading-6 text-gray-900"
                  >
                    {CONSTANTS.LABEL.PASSWORD}
                    {/* Eye icon for show/hide password */}
                    <span
                      className="absolute inset-y-0 right-3 top-12 flex items-center cursor-pointer z-50"
                      onClick={togglePasswordVisibility}
                    >
                      <FontAwesomeIcon
                        icon={showPassword ? faEyeSlash : faEye}
                        className="text-gray-600"
                      />
                    </span>
                  </label>
                  <Field
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className="custom-input bg-white/5 backdrop-blur-md border-gray-500 focus:border-blue-500 focus:ring-blue-500 placeholder-gray-600"
                    placeholder="Enter password"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-xs text-rose-800 text-left"
                  />
                </div>

                {/* <div className="captcha-section mb-6">
                <div className="flex items- justify-center gap-5 mb-3">
                  <div className="rounded-lg border border-secondary overflow-hidden">
                    <img
                      src={`data:image/svg+xml;base64,${captcha}`}
                      alt="Captcha"
                      className="captcha-image"
                    />
                  </div>
                  <div
                    type="button"
                    onClick={() => setResetCaptcha(!resetCaptcha)}
                    className="p-1 flex items-center justify-center cursor-pointer"
                  >
                    <LuRefreshCw
                      size={20}
                      className="text-blue-400 hover:text-blue-500"
                    />
                  </div>
                </div>
                <Field
                  type="text"
                  name="captchaInput"
                  className="custom-input bg-white/5 backdrop-blur-sm  border-gray-500 focus:border-blue-500 focus:ring-blue-500 placeholder-gray-600"
                  placeholder="Enter captcha"
                />
                <ErrorMessage
                  name="captchaInput"
                  component="div"
                  className="text-xs text-rose-800 text-left"
                />
              </div> */}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary2 text-white py-2 px-4 w-full rounded-lg hover:bg-primary"
                >
                  {isSubmitting ? 'Loggin In...' : CONSTANTS.BUTTON.LOGIN}
                </button>
                <div className="pt-3">
                  <span
                    className="text-blue-700 relative cursor-pointer group text-xs font-semibold uppercase"
                    onClick={() => setIsForgotModalOpen(true)}
                  >
                    {CONSTANTS.LINK.FORGOT_PASSWORD}
                    <Underline />
                  </span>
                </div>
                <div className="pt-3">
                  <Link
                    className="text-blue-700 relative cursor-pointer group text-xs font-semibold uppercase"
                    to="/teant-logins"
                  >
                    Login As Student
                    <Underline />
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <Toaster />
      {isForgotModalOpen && (
        <TroubleLogin
          closeModal={() => {
            setIsForgotModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default LoginPage;
